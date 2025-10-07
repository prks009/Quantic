import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { CreateLeadDto } from '../dto/create-lead.dto';
import { v4 as uuidv4 } from 'uuid';
import { FilterLeadsDto } from '../dto/filter-leads.dto';
import { UpdateLeadDto } from '../dto/update-lead.dto';

@Injectable()
export class LeadsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(createLeadDto: CreateLeadDto, user: any) {
        const { name, company } = createLeadDto;
        const db = this.databaseService.getDb();

        const stmt = db.prepare(
            'INSERT INTO leads (id, owner_id, name, company) VALUES (?, ?, ?, ?)',
        );
        const leadId = uuidv4();
        stmt.run(leadId, user.userId, name, company);

        return this.findOne(leadId, user);
    }

    async findAll(user: any, filters: FilterLeadsDto) {
        const db = this.databaseService.getDb();
        let query = 'SELECT * FROM leads WHERE 1 = 1';
        const params: any[] = [];

        // Reps can only see their own leads (BAsic RBAC as per requirement)
        if (user.role === 'rep') {
            query += ' AND owner_id = ?';
            params.push(user.userId);
        }

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }
        if (filters.createdFrom) {
            query += ' AND created_at >= ?';
            params.push(new Date(filters.createdFrom).toISOString());
        }
        if (filters.createdTo) {
            query += ' AND created_at <= ?';
            params.push(new Date(filters.createdTo).toISOString());
        }

        const stmt = db.prepare(query);
        return stmt.all(params);
    }

    async findOne(id: string, user: any) {
        const db = this.databaseService.getDb();
        const stmt = db.prepare('SELECT * FROM leads WHERE id = ?');
        const lead: any = stmt.get(id);

        if (!lead) {
            throw new NotFoundException(`Lead with ID ${id} not found.`);
        }

        // Reps can only see their own leads (Basic RBAC as per requirement)
        if (user.role === 'rep' && lead.owner_id !== user.userId) {
            throw new ForbiddenException('insufficient permissions.');
        }

        return lead;
    }

    async update(id: string, updateLeadDto: UpdateLeadDto, user: any) {

        await this.findOne(id, user); //Here checking permission

        const fieldsToUpdate = Object.keys(updateLeadDto);


        if (fieldsToUpdate.length === 0) {
            return this.findOne(id, user);
        }

        const setClauseParts: any[] = [];
        const queryParameters: any[] = [];


        for (const field of fieldsToUpdate) {

            setClauseParts.push(`${field} = ?`);


            queryParameters.push(updateLeadDto[field]);
        }


        const finalSetClause = setClauseParts.join(', ');

        queryParameters.push(id);

        const db = this.databaseService.getDb();
        const sqlQuery = `UPDATE leads SET ${finalSetClause} WHERE id = ?`;

        const stmt = db.prepare(sqlQuery);
        stmt.run(queryParameters);

        return this.findOne(id, user);
    }

    async remove(id: string, user: any) {
        await this.findOne(id, user); //Here checking permission
        const db = this.databaseService.getDb();
        const stmt = db.prepare('DELETE FROM leads WHERE id = ?');
        stmt.run(id);
        return { message: `Deleted` };
    }

    async convert(id: string, user: any) {
        const lead = await this.findOne(id, user);
        if (lead.status === 'qualified') {
            throw new ForbiddenException('already converted.');
        }
        const db = this.databaseService.getDb();
        const transaction = db.transaction(() => {
            const accountId = uuidv4();
            const createAccountStmt = db.prepare(
                'INSERT INTO accounts (id, owner_id, name) VALUES (?, ?, ?)',
            );
            createAccountStmt.run(accountId, lead.owner_id, lead.company || lead.name);

            const updateLeadStmt = db.prepare(
                "UPDATE leads SET status = 'qualified' WHERE id = ?",
            );
            updateLeadStmt.run(id);

            const newAccount = db.prepare('SELECT * FROM accounts WHERE id = ?').get(accountId);
            return newAccount;
        });

        return transaction();
    }
}