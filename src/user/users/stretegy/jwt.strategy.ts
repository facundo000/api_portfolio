import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "src/user/users/entities/user.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../interface/jwt-payload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,

        confService: ConfigService
    ){
        super({
            secretOrKey: confService.get<string>('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate( payload: JwtPayload ): Promise<User> {
        
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id_user: id });

        if ( !user ) 
            throw new UnauthorizedException('Token not valid')
            
        // if ( !user.esActivo ) 
        //     throw new UnauthorizedException('User is inactive, talk with an admin');
        

        return user;
    }
}