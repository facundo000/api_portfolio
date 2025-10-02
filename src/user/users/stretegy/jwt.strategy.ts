import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "src/user/users/entities/user.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../interface/jwt-payload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,

        private readonly confService: ConfigService
    ){
        super({
            secretOrKey: confService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false
        });
        console.log('JWT Strategy initialized with secret:', !!confService.get('JWT_SECRET')); // Log para verificar la inicialización
    }

    async validate( payload: JwtPayload ): Promise<User> {
        try {
            console.log('Attempting to validate token with payload:', payload);
            
            if (!payload || !payload.id) {
                console.log('Invalid payload structure:', payload);
                throw new UnauthorizedException('Invalid token structure');
            }

            const { id } = payload;
            console.log('Looking for user with id:', id);

            const user = await this.userRepository.findOneBy({ id_user: id });

            if (!user) {
                console.log('User not found for id:', id);
                throw new UnauthorizedException('Token not valid');
            }

            console.log('User found:', user);
            return user;

        } catch (error) {
            console.error('Error in validate method:', error);
            throw error;
        }
    }
}