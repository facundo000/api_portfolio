import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Auth } from 'src/user/users/decorators/auth.decorator';
import { ValidRoles } from 'src/user/users/interface/valid-roles';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @Auth( ValidRoles.USER )
  
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(id);
  }

  @Patch(':id')
    @Auth( ValidRoles.USER )

  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
    @Auth( ValidRoles.USER )

  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }

  // Métodos adicionales útiles

  @Get('by-type/:typeId')
  findByType(@Param('typeId') typeId: string) {
    return this.linksService.findByType(typeId);
  }

  @Get('search/by-url')
  findByUrl(@Query('url') url: string) {
    return this.linksService.findByUrl(url);
  }

  @Get('stats/with-project-count')
  getLinksWithProjectCount() {
    return this.linksService.getLinksWithProjectCount();
  }

  @Get('for-project/:projectId')
  findLinksForProject(@Param('projectId') projectId: string) {
    return this.linksService.findLinksForProject(projectId);
  }

  @Get('stats/most-used')
  findMostUsedLinks(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.linksService.findMostUsedLinks(limitNumber);
  }
}
