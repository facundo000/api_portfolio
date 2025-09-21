import { Module } from '@nestjs/common';
import { TypesLinksService } from './types_links.service';
import { TypesLinksController } from './types_links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/links/entities/link.entity';
import { TypesLink } from './entities/types_link.entity';

@Module({
  controllers: [TypesLinksController],
  providers: [TypesLinksService],
  imports: [
      TypeOrmModule.forFeature([
        TypesLink,
        Link
      ])
    ]
})
export class TypesLinksModule {}
