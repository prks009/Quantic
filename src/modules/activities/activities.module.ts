import { Module } from '@nestjs/common';
import { ActivitiesService } from './services/activities.service';
import { ActivitiesController } from './controllers/activities.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    imports: [AccountsModule],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
})
export class ActivitiesModule { }