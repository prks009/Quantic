import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email address should be valid' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string;
}