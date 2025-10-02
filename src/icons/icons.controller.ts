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
import { IconsService } from './icons.service';
import { CreateIconDto } from './dto/create-icon.dto';
import { UpdateIconDto } from './dto/update-icon.dto';
import { ValidRoles } from 'src/user/users/interface/valid-roles';
import { Auth } from 'src/user/users/decorators/auth.decorator';

@Controller('icons')
export class IconsController {
  constructor(private readonly iconsService: IconsService) {}

  @Post()
    @Auth( ValidRoles.USER )
  
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createIconDto: CreateIconDto) {
    return this.iconsService.create(createIconDto);
  }

  @Get()
  findAll() {
    return this.iconsService.findAll();
  }

  @Get('search')
  searchIcons(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      return this.iconsService.findAll();
    }
    return this.iconsService.searchIcons(searchTerm);
  }

  @Get('type/:typeId')
  findByType(@Param('typeId', ParseUUIDPipe) typeId: string) {
    return this.iconsService.findByType(typeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.iconsService.findOne(id);
  }

  @Patch(':id')
    @Auth( ValidRoles.USER )
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateIconDto: UpdateIconDto
  ) {
    return this.iconsService.update(id, updateIconDto);
  }

  @Delete(':id')
    @Auth( ValidRoles.USER )
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.iconsService.remove(id);
  }

  // @Delete('type/:typeId')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // removeByType(@Param('typeId', ParseUUIDPipe) typeId: string) {
  //   return this.iconsService.removeByType(typeId);
  // }
}
