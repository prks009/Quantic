import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateActivityDto {
  @IsIn(['call', 'email', 'demo'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  next_follow_up?: string;
}
