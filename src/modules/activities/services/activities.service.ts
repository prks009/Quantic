import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountsService } from 'src/modules/accounts/services/accounts.service';
import { DatabaseService } from 'src/common/database/database.service';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { UpdatesGateway } from 'src/common/updates/updates.gateway';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly accountsService: AccountsService,
    private readonly updatesGateway: UpdatesGateway,
  ) {}

  async create(
    accountId: string,
    createActivityDto: CreateActivityDto,
    user: any,
  ) {
    await this.accountsService.findOne(accountId, user);

    const { type, notes, next_follow_up } = createActivityDto;
    const db = this.databaseService.getDb();
    const activityId = uuidv4();

    const stmt = db.prepare(
      'INSERT INTO activities (id, account_id, user_id, type, notes, next_follow_up) VALUES (?, ?, ?, ?, ?, ?)',
    );
    stmt.run(activityId, accountId, user.userId, type, notes, next_follow_up);
    const newActivity = this.findOne(accountId, activityId, user);

    this.updatesGateway.broadcastActivityUpdate({
      event: 'activity_created',
      data: newActivity,
    });

    return newActivity;
  }

  async findAll(accountId: string, user: any) {
    await this.accountsService.findOne(accountId, user);

    const db = this.databaseService.getDb();
    const stmt = db.prepare('SELECT * FROM activities WHERE account_id = ?');
    return stmt.all(accountId);
  }

  async findOne(accountId: string, activityId: string, user: any) {
    await this.accountsService.findOne(accountId, user);

    const db = this.databaseService.getDb();
    const stmt = db.prepare(
      'SELECT * FROM activities WHERE id = ? AND account_id = ?',
    );
    const activity = stmt.get(activityId, accountId);

    if (!activity) {
      throw new NotFoundException(`Not exist`);
    }
    return activity;
  }

  async update(
    accountId: string,
    activityId: string,
    updateActivityDto: UpdateActivityDto,
    user: any,
  ) {
    const existingActivity = await this.findOne(accountId, activityId, user);
    const mergedData = { ...existingActivity, ...updateActivityDto };
    const db = this.databaseService.getDb();

    const stmt = db.prepare(
      'UPDATE activities SET type = ?, notes = ?, next_follow_up = ? WHERE id = ?',
    );
    stmt.run(
      mergedData.type,
      mergedData.notes,
      mergedData.next_follow_up,
      activityId,
    );

    const updatedActivity = await this.findOne(accountId, activityId, user);

    this.updatesGateway.broadcastActivityUpdate({
      event: 'activity_updated',
      data: updatedActivity,
    });

    return updatedActivity;
  }

  async remove(accountId: string, activityId: string, user: any) {
    await this.findOne(accountId, activityId, user); // permission and existence checking
    const db = this.databaseService.getDb();
    const stmt = db.prepare('DELETE FROM activities WHERE id = ?');
    stmt.run(activityId);
    return { message: 'Deleted' };
  }
}
