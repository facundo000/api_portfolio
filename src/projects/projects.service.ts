import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto, 
    files?: { img?: Express.Multer.File[], gif?: Express.Multer.File[] }
  ): Promise<Project> {
    try {
      // Verificar si ya existe un proyecto con el mismo título en inglés
      const existingProject = await this.projectRepository.findOne({
        where: { title_en: createProjectDto.title_en }
      });

      if (existingProject) {
        throw new BadRequestException(`Project with title '${createProjectDto.title_en}' already exists`);
      }

      let imgUrl: string | null = null;
      let gifUrl: string | null = null;

      // Subir imagen si se proporciona
      if (files?.img && files.img.length > 0) {
        try {
          imgUrl = await this.cloudinaryService.uploadImage(files.img[0], 'projects');
        } catch (error) {
          throw new BadRequestException('Error uploading image: ' + error.message);
        }
      }

      // Subir gif si se proporciona
      if (files?.gif && files.gif.length > 0) {
        try {
          gifUrl = await this.cloudinaryService.uploadGif(files.gif[0], 'projects/gifs');
        } catch (error) {
          // Si falla la subida del gif, eliminar la imagen ya subida
          if (imgUrl) {
            try {
              const publicId = this.cloudinaryService.extractPublicId(imgUrl);
              if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
              }
            } catch (deleteError) {
              console.warn('Error deleting uploaded image after gif upload failure:', deleteError.message);
            }
          }
          throw new BadRequestException('Error uploading gif: ' + error.message);
        }
      }

      // Crear nueva instancia del proyecto con las URLs de Cloudinary
      const { user_id, ...projectData } = createProjectDto;
      const newProject = this.projectRepository.create({
        ...projectData,
        user: { id_user: user_id }
      });
      
      // Asignar las URLs solo si existen
      if (imgUrl) {
        newProject.img = imgUrl;
      }
      if (gifUrl) {
        newProject.gif = gifUrl;
      }
      
      // Guardar en la base de datos
      const savedProject = await this.projectRepository.save(newProject);
      
      // Retornar con relaciones
      return await this.findOne(savedProject.id_project);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error creating project: ' + error.message);
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      return await this.projectRepository.find({
        relations: [ 'projects_icons', 'projects_links'],
        order: {
          title_en: 'ASC'
        }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching projects: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Project> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id_project: id },
        relations: ['user', 'projects_icons', 'projects_links']
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching project: ' + error.message);
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    try {
      // Verificar si el proyecto existe
      const existingProject = await this.findOne(id);

      // Si se está actualizando el título en inglés, verificar que no exista otro proyecto con ese título
      if (updateProjectDto.title_en && updateProjectDto.title_en !== existingProject.title_en) {
        const projectWithSameTitle = await this.projectRepository.findOne({
          where: { title_en: updateProjectDto.title_en }
        });

        if (projectWithSameTitle && projectWithSameTitle.id_project !== id) {
          throw new BadRequestException(`Project with title '${updateProjectDto.title_en}' already exists`);
        }
      }

      // Si se está actualizando la imagen, eliminar la imagen anterior de Cloudinary
      if (updateProjectDto.img && existingProject.img && updateProjectDto.img !== existingProject.img) {
        try {
          const publicId = this.cloudinaryService.extractPublicId(existingProject.img);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        } catch (error) {
          console.warn('Error deleting old image from Cloudinary:', error.message);
        }
      }

      // Si se está actualizando el gif, eliminar el gif anterior de Cloudinary
      if (updateProjectDto.gif && existingProject.gif && updateProjectDto.gif !== existingProject.gif) {
        try {
          const publicId = this.cloudinaryService.extractPublicId(existingProject.gif);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        } catch (error) {
          console.warn('Error deleting old gif from Cloudinary:', error.message);
        }
      }

      // Actualizar los campos
      await this.projectRepository.update(id, updateProjectDto);

      // Retornar el proyecto actualizado
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error updating project: ' + error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      // Verificar si el proyecto existe
      const project = await this.findOne(id);

      // Eliminar imágenes de Cloudinary si existen
      if (project.img) {
        try {
          const publicId = this.cloudinaryService.extractPublicId(project.img);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        } catch (error) {
          console.warn('Error deleting image from Cloudinary:', error.message);
        }
      }

      if (project.gif) {
        try {
          const publicId = this.cloudinaryService.extractPublicId(project.gif);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        } catch (error) {
          console.warn('Error deleting gif from Cloudinary:', error.message);
        }
      }

      // Eliminar el proyecto
      await this.projectRepository.remove(project);

      return { message: `Project with ID ${id} has been successfully deleted` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error deleting project: ' + error.message);
    }
  }

  // Métodos adicionales útiles

  async findByTitle(title: string): Promise<Project[]> {
    try {
      return await this.projectRepository.find({
        where: [
          { title_en: title },
          { title_es: title }
        ],
        relations: ['user', 'projects_icons', 'projects_links'],
        order: { title_en: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching projects by title: ' + error.message);
    }
  }

  async getProjectsWithLinkCount(): Promise<any[]> {
    try {
      return await this.projectRepository
        .createQueryBuilder('project')
        .leftJoin('project.projects_links', 'projectLink')
        .select([
          'project.id_project',
          'project.title_en',
          'project.title_es',
          'COUNT(projectLink.id_project_link) as linkCount'
        ])
        .groupBy('project.id_project')
        .addGroupBy('project.title_en')
        .addGroupBy('project.title_es')
        .orderBy('linkCount', 'DESC')
        .getRawMany();
    } catch (error) {
      throw new BadRequestException('Error fetching projects with link count: ' + error.message);
    }
  }

  async getProjectsWithIconCount(): Promise<any[]> {
    try {
      return await this.projectRepository
        .createQueryBuilder('project')
        .leftJoin('project.projects_icons', 'projectIcon')
        .select([
          'project.id_project',
          'project.title_en',
          'project.title_es',
          'COUNT(projectIcon.id_project_icon) as iconCount'
        ])
        .groupBy('project.id_project')
        .addGroupBy('project.title_en')
        .addGroupBy('project.title_es')
        .orderBy('iconCount', 'DESC')
        .getRawMany();
    } catch (error) {
      throw new BadRequestException('Error fetching projects with icon count: ' + error.message);
    }
  }

  async uploadImage(projectId: string, file: Express.Multer.File): Promise<{ message: string; imageUrl: string }> {
    try {
      const project = await this.findOne(projectId);

      // Eliminar imagen anterior si existe
      if (project.img) {
        try {
          const publicId = this.cloudinaryService.extractPublicId(project.img);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        } catch (error) {
          console.warn('Error deleting old image from Cloudinary:', error.message);
        }
      }

      // Subir nueva imagen
      const imageUrl = await this.cloudinaryService.uploadImage(file, 'projects');

      // Actualizar el proyecto con la nueva URL
      await this.projectRepository.update(projectId, { img: imageUrl });

      return {
        message: 'Image uploaded successfully',
        imageUrl: imageUrl
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error uploading image: ' + error.message);
    }
  }

  async uploadGif(projectId: string, file: Express.Multer.File): Promise<{ message: string; gifUrl: string }> {
    try {
      const project = await this.findOne(projectId);

      // Eliminar gif anterior si existe
      if (project.gif) {
        try {
          const publicId = this.cloudinaryService.extractPublicId(project.gif);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        } catch (error) {
          console.warn('Error deleting old gif from Cloudinary:', error.message);
        }
      }

      // Subir nuevo gif
      const gifUrl = await this.cloudinaryService.uploadGif(file, 'projects/gifs');

      // Actualizar el proyecto con la nueva URL
      await this.projectRepository.update(projectId, { gif: gifUrl });

      return {
        message: 'GIF uploaded successfully',
        gifUrl: gifUrl
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error uploading GIF: ' + error.message);
    }
  }
}
