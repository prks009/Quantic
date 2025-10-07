import { IsIn, IsOptional, IsString } from 'class-validator';
export class UpdateLeadDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    company?: string;

    @IsIn(['new', 'working', 'qualified', 'disqualified'])
    @IsOptional()
    status?: string;
}