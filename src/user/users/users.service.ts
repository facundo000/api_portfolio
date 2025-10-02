import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async register(createUserDto: CreateUserDto) {
      try{
        const { password, ...userData } = createUserDto;

        const user = this.UserRepository.create(
          {
            ...userData,
            role: 'user',
            password: bcrypt.hashSync(password, 10)
          }
        );
        await this.UserRepository.save(user);
         
        const { password: _,...userWithoutPassword } = user;
  
        return {
          ...userWithoutPassword,
          token: this.getJwtToken({ id: user.id_user})
        };
      }
      catch(error){
        console.log(error)
      }
    }

    async login(createUserDto: CreateUserDto){
      const {username, password } = createUserDto;
      const user = await this.UserRepository.findOne({
        where: {username},
        select: {username: true, password: true, id_user:true}
      });

      if(!user){
        throw new UnauthorizedException('Invalid credentials - Username')
      }

      if(!bcrypt.compareSync(password, user.password)){
        throw new UnauthorizedException('Invalid credentials - password')
      }

       return {
        user: user,
        token: this.getJwtToken({ id: user.id_user })
      }
    }

    private getJwtToken( payload: JwtPayload ) {
      const token = this.jwtService.sign( payload );
      return token;
    }

  // async checkAuthStatus( user: User ) {
  
  //   return {
  //     user: user,
  //     token: this.getJwtToken({ id: user.id_user }),
  //   }
  // }
}
