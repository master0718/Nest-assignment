import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async validateUserByJwtPayload(payload: any): Promise<any> {
        const user = await this.usersService.findOneByEmail(payload.email);
        if (!user) {
          return null;
        }
        return user;
      }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
            }),
        };
    }

    async register(name: string, email: string, password: string, roles: string[]) {
        const newUser = await this.usersService.create(name, email, password, roles);
        const { password: _, ...result } = newUser;
        return result;
    }
}
