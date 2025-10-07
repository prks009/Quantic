import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
    @IsIn(['call', 'email', 'demo'])
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsDateString()
    @IsOptional()
    next_follow_up?: string;
}