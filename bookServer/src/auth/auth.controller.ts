import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from './dto/create.user.dto';
import { UserAuthDto } from './dto/auth.user.dto';

@Controller('users')
export class AuthController {
    constructor(private readonly userservise: AuthService) {}

    @Post("signup")
    async signup(@Body() dto: UserCreateDto) {
        return this.userservise.signup(dto)
    }

    @Post("signin")
    async signin(@Body() dto: UserAuthDto) {
        return this.userservise.signin(dto)
    }
}
