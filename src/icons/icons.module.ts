import { Module } from '@nestjs/common';
import { IconsService } from './icons.service';
import { IconsController } from './icons.controller';
import { Icon } from './entities/icon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [IconsController],
  providers: [IconsService],
  imports: [
    TypeOrmModule.forFeature([
      Icon
    ])
  ],
  exports: [IconsService]
})
export class IconsModule {}
