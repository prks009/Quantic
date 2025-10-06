
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDto {
    @IsEmail({}, { message: 'Email address should be valid' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password shoud have 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password should have at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;
}