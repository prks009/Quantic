
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { SignUpDto } from '../dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from '../dto/login.dto';
import { sign } from 'jsonwebtoken';
import { jwtConstants } from 'src/common/database/utils/constants';

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService) { }

    async signup(signUpDto: SignUpDto): Promise<{ message: string }> {
        const { email, password } = signUpDto;
        const db = this.databaseService.getDb();

        const findUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
        const existingUser = findUserStmt.get(email);

        if (existingUser) {
            throw new ConflictException('User is already exist');
        }

        const saltRounds = jwtConstants.saltRounds;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            const insertStmt = db.prepare(
                'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
            );
            const userId = uuidv4();
            insertStmt.run(userId, email, hashedPassword);
            return { message: 'Signup is successful' };
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const { email, password } = loginDto;
        const db = this.databaseService.getDb();

        const findUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = findUserStmt.get(email) as any;

        if (!user) {
            throw new UnauthorizedException('credentials are invalid');
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordMatching) {
            throw new UnauthorizedException('credentials are invalid');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = sign(payload, jwtConstants.secret, { expiresIn: '1h' });

        return { accessToken };
    }
}