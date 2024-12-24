import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { AuthPayload } from "../dto/auth.user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authServise: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.SECRET,
        });
    }

    async validate(payload: AuthPayload) {
        const user = await this.authServise.validateUser(payload.id)
        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}