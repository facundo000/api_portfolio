import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus,
  ParseUUIDPipe 
} from '@nestjs/common';
import { ProjectsIconsService } from './projects_icons.service';
import { CreateProjectsIconDto } from './dto/create-projects_icon.dto';
import { UpdateProjectsIconDto } from './dto/update-projects_icon.dto';
import { Auth } from 'src/user/users/decorators/auth.decorator';
import { ValidRoles } from 'src/user/users/interface/valid-roles';

@Controller('projects-icons')
export class ProjectsIconsController {
  constructor(private readonly projectsIconsService: ProjectsIconsService) {}

  @Post()
  @Auth( ValidRoles.USER )  
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProjectsIconDto: CreateProjectsIconDto) {
    return this.projectsIconsService.create(createProjectsIconDto);
  }

  @Get()
  findAll() {
    return this.projectsIconsService.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.projectsIconsService.findByProject(projectId);
  }

  @Get('icon/:iconId')
  findByIcon(@Param('iconId', ParseUUIDPipe) iconId: string) {
    return this.projectsIconsService.findByIcon(iconId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsIconsService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.USER )
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProjectsIconDto: UpdateProjectsIconDto
  ) {
    return this.projectsIconsService.update(id, updateProjectsIconDto);
  }

  // @Delete(':id')
  //   @Auth( ValidRoles.USER )

  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.projectsIconsService.remove(id);
  // }

  // @Delete('project/:projectId')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // removeByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
  //   return this.projectsIconsService.removeByProject(projectId);
  // }

  // @Delete('icon/:iconId')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // removeByIcon(@Param('iconId', ParseUUIDPipe) iconId: string) {
  //   return this.projectsIconsService.removeByIcon(iconId);
  // }
}
