import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserSchema } from './user.model';

@Injectable()
export class UserService {
    constructor(@Inject(UserSchema) private user: Model<User>) { }

    async signup() {
        
    }
}
