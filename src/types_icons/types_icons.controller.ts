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
  ParseUUIDPipe,
  Query 
} from '@nestjs/common';
import { TypesIconsService } from './types_icons.service';
import { CreateTypesIconDto } from './dto/create-types_icon.dto';
import { UpdateTypesIconDto } from './dto/update-types_icon.dto';

@Controller('types-icons')
export class TypesIconsController {
  constructor(private readonly typesIconsService: TypesIconsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTypesIconDto: CreateTypesIconDto) {
    return this.typesIconsService.create(createTypesIconDto);
  }

  @Get()
  findAll() {
    return this.typesIconsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.typesIconsService.getStats();
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.typesIconsService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.typesIconsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateTypesIconDto: UpdateTypesIconDto
  ) {
    return this.typesIconsService.update(id, updateTypesIconDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.typesIconsService.remove(id);
  }
}
