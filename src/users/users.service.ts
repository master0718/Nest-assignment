import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async create(name: string, email: string, password: string, roles: string[]): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = this.usersRepository.create({ name, email, password: hashedPassword, roles });

        return this.usersRepository.save(user);
    }
}
