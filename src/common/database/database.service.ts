import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  private db: Database.Database;

  onModuleInit() {
    this.db = new Database('crm.sqlite');
    console.log('Database is conected');

    this.seedDatabase();
  }

  onApplicationShutdown(signal?: string) {
    if (this.db && this.db.open) {
      this.db.close();
      console.log('Database connection is closed');
    }
  }

  getDb(): Database.Database {
    return this.db;
  }

  private seedDatabase() {
    try {
      const seedScript = readFileSync(
        join(process.cwd(), 'sql', 'seed.sql'),
        'utf8',
      );
      this.db.exec(seedScript);
      console.log('Database is seeded');
    } catch (error) {
      console.error('Seed Error', error);
    }
  }
}
