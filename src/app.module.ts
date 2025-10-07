import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LeadsController } from './modules/leads/controllers/leads.controller';
import { LeadsService } from './modules/leads/services/leads.service';
import { AccountsController } from './modules/accounts/controllers/accounts.controller';
import { AccountsService } from './modules/accounts/services/accounts.service';
import { ActivitiesController } from './modules/activities/controllers/activities.controller';
import { ActivitiesService } from './modules/activities/services/activities.service';
import { DatabaseModule } from './common/database/database.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { UpdatesGateway } from './common/updates/updates.gateway';
import { UpdatesModule } from './common/updates/updates.module';
import rateLimit from 'express-rate-limit';

@Module({
  imports: [AuthModule, DatabaseModule, AccountsModule, ActivitiesModule, UpdatesModule],
  controllers: [AppController, LeadsController, AccountsController, ActivitiesController],
  providers: [AppService, LeadsService, AccountsService, ActivitiesService, UpdatesGateway],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          limit: 100,
          message: 'please try again later',
        }),
      )
      .forRoutes('auth'); // auth routes as per doc
  }
}

