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
import { AccountsService } from '../services/accounts.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Post()
    create(@Body() createAccountDto: CreateAccountDto, @Req() req: any) {
        return this.accountsService.create(createAccountDto, req.user);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.accountsService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.accountsService.findOne(id, req.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAccountDto: UpdateAccountDto,
        @Req() req: any,
    ) {
        return this.accountsService.update(id, updateAccountDto, req.user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string, @Req() req: any) {
        return this.accountsService.remove(id, req.user);
    }

    @Get('reports/recent-activity')
    findWithRecentActivity(@Req() req: any) {
        return this.accountsService.findWithRecentActivity(req.user);
    }

}