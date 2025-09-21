import { Module } from '@nestjs/common';
import { ProjectsIconsService } from './projects_icons.service';
import { ProjectsIconsController } from './projects_icons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsIcon } from './entities/projects_icon.entity';

@Module({
  controllers: [ProjectsIconsController],
  providers: [ProjectsIconsService],
  imports: [
    TypeOrmModule.forFeature([
      ProjectsIcon
    ])
  ],
  exports: [ProjectsIconsService]
})
export class ProjectsIconsModule {}
