import { Controller, Post } from '@nestjs/common';
import { UserSchema } from './user.model';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userservise: UserService) {}

    @Post("signup")
    async signup() {
        return this.userservise.signup()
    }

}
