import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './auth.model';
import { UserCreateDto } from './dto/create.user.dto';
import { UserAuthDto } from './dto/auth.user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash, compare } from "bcryptjs";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel("User") private user: Model<User>,
        private readonly jwtService: JwtService
    ) { }

    async signup(dto: UserCreateDto): Promise<User> {
        const salt = await genSalt(10);
        const passwordHash = await hash(dto.password, salt)
        const newUser = await this.user.create({ ...dto, password: passwordHash })
        return newUser.save()
    }

    async signin(dto: UserAuthDto): Promise<{ id: string, token: string }> {
        const user = await this.user.findOne({ "email": dto.email })
        if (!user) {
            throw new UnauthorizedException()
        }
        const isCorrectPassword = await compare(
            dto.password,
            user.password,
        );
        if (!isCorrectPassword) {
            throw new UnauthorizedException();
        }
        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName
        }
        const token = await this.jwtService.signAsync(payload, { secret: process.env.SECRET })
        return { id: user.id, token }
    }

    async validateUser(id: string): Promise<User | null> {
        const user = await this.user.findById(id)
        if (!user) {
            return null
        }
        return user
    }
}
