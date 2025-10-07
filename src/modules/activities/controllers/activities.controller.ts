import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ActivitiesService } from '../services/activities.service';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('accounts/:accountId/activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @Post()
    create(
        @Param('accountId') accountId: string,
        @Body() createActivityDto: CreateActivityDto,
        @Req() req: any,
    ) {
        return this.activitiesService.create(accountId, createActivityDto, req.user);
    }

    @Get()
    findAll(@Param('accountId') accountId: string, @Req() req: any) {
        return this.activitiesService.findAll(accountId, req.user);
    }

    @Get(':activityId')
    findOne(
        @Param('accountId') accountId: string,
        @Param('activityId') activityId: string,
        @Req() req: any,
    ) {
        return this.activitiesService.findOne(accountId, activityId, req.user);
    }

    @Patch(':activityId')
    update(
        @Param('accountId') accountId: string,
        @Param('activityId') activityId: string,
        @Body() updateActivityDto: UpdateActivityDto,
        @Req() req: any,
    ) {
        return this.activitiesService.update(
            accountId,
            activityId,
            updateActivityDto,
            req.user,
        );
    }

    @Delete(':activityId')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param('accountId') accountId: string,
        @Param('activityId') activityId: string,
        @Req() req: any,
    ) {
        return this.activitiesService.remove(accountId, activityId, req.user);
    }
}