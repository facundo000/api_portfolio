import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { TypesLink } from '../types_links/entities/types_link.entity';

@Module({
  controllers: [LinksController],
  providers: [LinksService],
  imports: [
      TypeOrmModule.forFeature([
        Link,
        TypesLink
      ])
    ],
  exports: [LinksService]
})
export class LinksModule {}
