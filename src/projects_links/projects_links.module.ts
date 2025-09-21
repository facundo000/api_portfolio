import { Module } from '@nestjs/common';
import { ProjectsLinksService } from './projects_links.service';
import { ProjectsLinksController } from './projects_links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsLink } from './entities/projects_link.entity';
import { Project } from '../projects/entities/project.entity';
import { Link } from '../links/entities/link.entity';

@Module({
  controllers: [ProjectsLinksController],
  providers: [ProjectsLinksService],
  imports: [
      TypeOrmModule.forFeature([
        ProjectsLink,
        Project,
        Link
      ])
    ],
  exports: [ProjectsLinksService]
})
export class ProjectsLinksModule {}
