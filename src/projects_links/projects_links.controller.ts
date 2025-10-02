import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectsLinksService } from './projects_links.service';
import { CreateProjectsLinkDto } from './dto/create-projects_link.dto';
import { UpdateProjectsLinkDto } from './dto/update-projects_link.dto';
import { Auth } from 'src/user/users/decorators/auth.decorator';
import { ValidRoles } from 'src/user/users/interface/valid-roles';

@Controller('projects-links')
export class ProjectsLinksController {
  constructor(private readonly projectsLinksService: ProjectsLinksService) {}

  @Post()
  @Auth( ValidRoles.USER )
  create(@Body() createProjectsLinkDto: CreateProjectsLinkDto) {
    return this.projectsLinksService.create(createProjectsLinkDto);
  }

  @Get()
  findAll() {
    return this.projectsLinksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsLinksService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.USER )
  
  update(@Param('id') id: string, @Body() updateProjectsLinkDto: UpdateProjectsLinkDto) {
    return this.projectsLinksService.update(id, updateProjectsLinkDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.USER )

  remove(@Param('id') id: string) {
    return this.projectsLinksService.remove(id);
  }

  // Métodos adicionales útiles

  @Get('by-project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.projectsLinksService.findByProject(projectId);
  }

  @Get('by-link/:linkId')
  findByLink(@Param('linkId') linkId: string) {
    return this.projectsLinksService.findByLink(linkId);
  }

  @Get('find/:projectId/:linkId')
  findByProjectAndLink(
    @Param('projectId') projectId: string,
    @Param('linkId') linkId: string
  ) {
    return this.projectsLinksService.findByProjectAndLink(projectId, linkId);
  }

  // @Delete('remove/:projectId/:linkId')
  // removeByProjectAndLink(
  //   @Param('projectId') projectId: string,
  //   @Param('linkId') linkId: string
  // ) {
  //   return this.projectsLinksService.removeByProjectAndLink(projectId, linkId);
  // }

  @Get('stats/project-link-stats')
  getProjectLinkStats() {
    return this.projectsLinksService.getProjectLinkStats();
  }

  @Get('stats/most-used-links')
  getMostUsedLinksInProjects(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.projectsLinksService.getMostUsedLinksInProjects(limitNumber);
  }
}
