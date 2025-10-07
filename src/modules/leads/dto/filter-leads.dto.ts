import { IsDateString, IsIn, IsOptional } from 'class-validator';
export class FilterLeadsDto {
  @IsIn(['new', 'working', 'qualified', 'disqualified'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  createdFrom?: string;

  @IsDateString()
  @IsOptional()
  createdTo?: string;
}
