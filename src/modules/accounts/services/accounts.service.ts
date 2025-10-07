import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateAccountDto } from '../dto/update-account.dto';

@Injectable()
export class AccountsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(createAccountDto: CreateAccountDto, user: any) {
        const { name, industry } = createAccountDto;
        const db = this.databaseService.getDb();

        const accountId = uuidv4();
        const stmt = db.prepare(
            'INSERT INTO accounts (id, owner_id, name, industry) VALUES (?, ?, ?, ?)',
        );
        stmt.run(accountId, user.userId, name, industry);

        return this.findOne(accountId, user);
    }

    async findAll(user: any) {
        const db = this.databaseService.getDb();
        let query = `
      SELECT
        a.*,
        COUNT(act.id) as activity_count
      FROM
        accounts a
      LEFT JOIN
        activities act ON a.id = act.account_id
    `;
        const params: any = [];

        // Basic RABC as per doc: Reps can only see their own accounts.
        if (user.role === 'rep') {
            query += ' WHERE a.owner_id = ?';
            params.push(user.userId);
        }

        query += ' GROUP BY a.id';

        const stmt = db.prepare(query);
        return stmt.all(params);
    }

    async findOne(id: string, user: any) {
        const db = this.databaseService.getDb();
        const query = `
      SELECT
        a.*,
        COUNT(act.id) as activity_count
      FROM
        accounts a
      LEFT JOIN
        activities act ON a.id = act.account_id
      WHERE
        a.id = ?
      GROUP BY
        a.id
    `;
        const stmt = db.prepare(query);
        const account: any = stmt.get(id);

        if (!account) {
            throw new NotFoundException('Account not exist');
        }

        if (user.role === 'rep' && account.owner_id !== user.userId) {
            throw new ForbiddenException('No Permission');
        }

        return account;
    }

    async update(id: string, updateAccountDto: UpdateAccountDto, user: any) {
        const existingAccount = await this.findOne(id, user);

        const mergedData = { ...existingAccount, ...updateAccountDto };
        const db = this.databaseService.getDb();
        const stmt = db.prepare(
            'UPDATE accounts SET name = ?, industry = ? WHERE id = ?',
        );
        stmt.run(mergedData.name, mergedData.industry, id);

        return this.findOne(id, user);
    }

    async remove(id: string, user: any) {
        await this.findOne(id, user); // Permission check
        const db = this.databaseService.getDb();
        const stmt = db.prepare('DELETE FROM accounts WHERE id = ?');
        stmt.run(id);


        return { message: "Deleted" };
    }
}