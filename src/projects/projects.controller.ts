import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Auth } from 'src/user/users/decorators/auth.decorator';
import { ValidRoles } from 'src/user/users/interface/valid-roles';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Auth( ValidRoles.USER )
  
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.USER )

  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.USER )

  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // Métodos adicionales útiles

  @Get('search/by-title')
  findByTitle(@Query('title') title: string) {
    return this.projectsService.findByTitle(title);
  }

  @Get('stats/with-link-count')
  getProjectsWithLinkCount() {
    return this.projectsService.getProjectsWithLinkCount();
  }

  @Get('stats/with-icon-count')
  getProjectsWithIconCount() {
    return this.projectsService.getProjectsWithIconCount();
  }

  // Endpoints para subida de archivos a Cloudinary

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    // Validar que sea una imagen
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed');
    }

    // Validar tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 10MB');
    }

    return this.projectsService.uploadImage(id, file);
  }

  @Post(':id/upload-gif')
  @UseInterceptors(FileInterceptor('gif'))
  async uploadGif(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No GIF file provided');
    }

    // Validar que sea un GIF o video
    const allowedMimeTypes = ['image/gif', 'video/mp4', 'video/webm'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only GIF, MP4, and WebM files are allowed');
    }

    // Validar tamaño del archivo (máximo 50MB para videos)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 50MB');
    }

    return this.projectsService.uploadGif(id, file);
  }
}
