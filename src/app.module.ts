import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LeadsController } from './modules/leads/controllers/leads.controller';
import { LeadsService } from './modules/leads/services/leads.service';
import { AccountsController } from './modules/accounts/controllers/accounts.controller';
import { AccountsService } from './modules/accounts/services/accounts.service';
import { ActivitiesController } from './modules/activities/controllers/activities.controller';
import { ActivitiesService } from './modules/activities/services/activities.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController, LeadsController, AccountsController, ActivitiesController],
  providers: [AppService, LeadsService, AccountsService, ActivitiesService],
})
export class AppModule { }
