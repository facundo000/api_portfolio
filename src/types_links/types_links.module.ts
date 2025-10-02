import { Module } from '@nestjs/common';
import { TypesLinksService } from './types_links.service';
import { TypesLinksController } from './types_links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/links/entities/link.entity';
import { TypesLink } from './entities/types_link.entity';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/user/users/entities/user.entity';

@Module({
  controllers: [TypesLinksController],
  providers: [TypesLinksService],
  imports: [
      TypeOrmModule.forFeature([
        TypesLink,
        Link
      ]),
      User        
    ]
})
export class TypesLinksModule {}
