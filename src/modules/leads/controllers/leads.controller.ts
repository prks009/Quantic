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
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { LeadsService } from '../services/leads.service';
import { CreateLeadDto } from '../dto/create-lead.dto';
import { UpdateLeadDto } from '../dto/update-lead.dto';
import { FilterLeadsDto } from '../dto/filter-leads.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post()
    create(@Body() createLeadDto: CreateLeadDto, @Req() req: any) {
        return this.leadsService.create(createLeadDto, req.user);
    }

    @Get()
    findAll(@Req() req: any, @Query() filters: FilterLeadsDto) {
        return this.leadsService.findAll(req.user, filters);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.leadsService.findOne(id, req.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLeadDto: UpdateLeadDto,
        @Req() req: any,
    ) {
        return this.leadsService.update(id, updateLeadDto, req.user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string, @Req() req: any) {
        return this.leadsService.remove(id, req.user);
    }

    @Post(':id/convert')
    convert(@Param('id') id: string, @Req() req: any) {
        return this.leadsService.convert(id, req.user);
    }
}