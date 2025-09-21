import { Module } from '@nestjs/common';
import { TypesIconsService } from './types_icons.service';
import { TypesIconsController } from './types_icons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesIcon } from './entities/types_icon.entity';

@Module({
  controllers: [TypesIconsController],
  providers: [TypesIconsService],
  imports: [
    TypeOrmModule.forFeature([
      TypesIcon
    ])
  ],
  exports: [TypesIconsService]
})
export class TypesIconsModule {}
