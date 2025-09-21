import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TypesLinksService } from './types_links.service';
import { CreateTypesLinkDto } from './dto/create-types_link.dto';
import { UpdateTypesLinkDto } from './dto/update-types_link.dto';

@Controller('types-links')
export class TypesLinksController {
  constructor(private readonly typesLinksService: TypesLinksService) {}

  @Post()
  create(@Body() createTypesLinkDto: CreateTypesLinkDto) {
    return this.typesLinksService.create(createTypesLinkDto);
  }

  @Get()
  findAll() {
    return this.typesLinksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typesLinksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypesLinkDto: UpdateTypesLinkDto) {
    return this.typesLinksService.update(id, updateTypesLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typesLinksService.remove(id);
  }

  // Métodos adicionales útiles

  @Get('search/by-name')
  findByName(@Query('name') name: string) {
    return this.typesLinksService.findByName(name);
  }

  @Get('stats/with-link-count')
  getTypesWithLinkCount() {
    return this.typesLinksService.getTypesWithLinkCount();
  }

  @Get('for-project/:projectId')
  findTypesForProject(@Param('projectId') projectId: string) {
    return this.typesLinksService.findTypesForProject(projectId);
  }
}
