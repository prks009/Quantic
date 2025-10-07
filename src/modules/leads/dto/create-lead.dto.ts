import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  company?: string;
}
