import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectsLinkDto } from './dto/create-projects_link.dto';
import { UpdateProjectsLinkDto } from './dto/update-projects_link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsLink } from './entities/projects_link.entity';
import { Project } from '../projects/entities/project.entity';
import { Link } from '../links/entities/link.entity';

@Injectable()
export class ProjectsLinksService {
  constructor(
    @InjectRepository(ProjectsLink)
    private readonly projectsLinkRepository: Repository<ProjectsLink>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async create(createProjectsLinkDto: CreateProjectsLinkDto): Promise<ProjectsLink> {
    try {
      // Verificar si el proyecto existe
      const projectExists = await this.projectRepository.findOne({
        where: { id_project: createProjectsLinkDto.project_id }
      });

      if (!projectExists) {
        throw new BadRequestException(`Project with ID '${createProjectsLinkDto.project_id}' not found`);
      }

      // Verificar si el link existe
      const linkExists = await this.linkRepository.findOne({
        where: { id_link: createProjectsLinkDto.link_id }
      });

      if (!linkExists) {
        throw new BadRequestException(`Link with ID '${createProjectsLinkDto.link_id}' not found`);
      }

      // Verificar si ya existe esta relación
      const existingRelation = await this.projectsLinkRepository.findOne({
        where: { 
          project_id: createProjectsLinkDto.project_id,
          link_id: createProjectsLinkDto.link_id 
        }
      });

      if (existingRelation) {
        throw new BadRequestException(`Relation between project '${createProjectsLinkDto.project_id}' and link '${createProjectsLinkDto.link_id}' already exists`);
      }

      // Crear nueva instancia de la relación
      const newProjectsLink = this.projectsLinkRepository.create(createProjectsLinkDto);
      
      // Guardar en la base de datos
      const savedProjectsLink = await this.projectsLinkRepository.save(newProjectsLink);
      
      // Retornar con relaciones
      return await this.findOne(savedProjectsLink.id_project_link);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error creating project-link relation: ' + error.message);
    }
  }

  async findAll(): Promise<ProjectsLink[]> {
    try {
      return await this.projectsLinkRepository.find({
        relations: ['project_id', 'link_id'],
        order: {
          id_project_link: 'ASC'
        }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching project-link relations: ' + error.message);
    }
  }

  async findOne(id: string): Promise<ProjectsLink> {
    try {
      const projectsLink = await this.projectsLinkRepository.findOne({
        where: { id_project_link: id },
        relations: ['project_id', 'link_id']
      });

      if (!projectsLink) {
        throw new NotFoundException(`Project-link relation with ID ${id} not found`);
      }

      return projectsLink;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching project-link relation: ' + error.message);
    }
  }

  async update(id: string, updateProjectsLinkDto: UpdateProjectsLinkDto): Promise<ProjectsLink> {
    try {
      // Verificar si la relación existe
      const existingRelation = await this.findOne(id);

      // Si se está actualizando el proyecto, verificar que exista
      if (updateProjectsLinkDto.project_id && updateProjectsLinkDto.project_id !== existingRelation.project_id) {
        const projectExists = await this.projectRepository.findOne({
          where: { id_project: updateProjectsLinkDto.project_id }
        });

        if (!projectExists) {
          throw new BadRequestException(`Project with ID '${updateProjectsLinkDto.project_id}' not found`);
        }
      }

      // Si se está actualizando el link, verificar que exista
      if (updateProjectsLinkDto.link_id && updateProjectsLinkDto.link_id !== existingRelation.link_id) {
        const linkExists = await this.linkRepository.findOne({
          where: { id_link: updateProjectsLinkDto.link_id }
        });

        if (!linkExists) {
          throw new BadRequestException(`Link with ID '${updateProjectsLinkDto.link_id}' not found`);
        }
      }

      // Si se está actualizando cualquiera de los IDs, verificar que no exista otra relación igual
      if ((updateProjectsLinkDto.project_id || updateProjectsLinkDto.link_id) && 
          (updateProjectsLinkDto.project_id !== existingRelation.project_id || updateProjectsLinkDto.link_id !== existingRelation.link_id)) {
        
        const relationToCheck = await this.projectsLinkRepository.findOne({
          where: { 
            project_id: updateProjectsLinkDto.project_id || existingRelation.project_id,
            link_id: updateProjectsLinkDto.link_id || existingRelation.link_id
          }
        });

        if (relationToCheck && relationToCheck.id_project_link !== id) {
          throw new BadRequestException(`Relation between project '${updateProjectsLinkDto.project_id || existingRelation.project_id}' and link '${updateProjectsLinkDto.link_id || existingRelation.link_id}' already exists`);
        }
      }

      // Actualizar los campos
      await this.projectsLinkRepository.update(id, updateProjectsLinkDto);

      // Retornar la relación actualizada
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error updating project-link relation: ' + error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      // Verificar si la relación existe
      const projectsLink = await this.findOne(id);

      // Eliminar la relación
      await this.projectsLinkRepository.remove(projectsLink);

      return { message: `Project-link relation with ID ${id} has been successfully deleted` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error deleting project-link relation: ' + error.message);
    }
  }

  // Métodos adicionales útiles

  async findByProject(projectId: string): Promise<ProjectsLink[]> {
    try {
      return await this.projectsLinkRepository.find({
        where: { project_id: projectId },
        relations: ['project_id', 'link_id'],
        order: { id_project_link: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching project-link relations by project: ' + error.message);
    }
  }

  async findByLink(linkId: string): Promise<ProjectsLink[]> {
    try {
      return await this.projectsLinkRepository.find({
        where: { link_id: linkId },
        relations: ['project_id', 'link_id'],
        order: { id_project_link: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching project-link relations by link: ' + error.message);
    }
  }

  async findByProjectAndLink(projectId: string, linkId: string): Promise<ProjectsLink | null> {
    try {
      return await this.projectsLinkRepository.findOne({
        where: { 
          project_id: projectId,
          link_id: linkId 
        },
        relations: ['project_id', 'link_id']
      });
    } catch (error) {
      throw new BadRequestException('Error fetching project-link relation by project and link: ' + error.message);
    }
  }

  async removeByProjectAndLink(projectId: string, linkId: string): Promise<{ message: string }> {
    try {
      const relation = await this.findByProjectAndLink(projectId, linkId);
      
      if (!relation) {
        throw new NotFoundException(`Relation between project '${projectId}' and link '${linkId}' not found`);
      }

      await this.projectsLinkRepository.remove(relation);

      return { message: `Relation between project '${projectId}' and link '${linkId}' has been successfully deleted` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error deleting project-link relation: ' + error.message);
    }
  }

  async getProjectLinkStats(): Promise<any[]> {
    try {
      return await this.projectsLinkRepository
        .createQueryBuilder('projectsLink')
        .leftJoin('projectsLink.project_id', 'project')
        .leftJoin('projectsLink.link_id', 'link')
        .leftJoin('link.type', 'type')
        .select([
          'projectsLink.id_project_link',
          'project.title_en as projectTitle',
          'link.link as linkUrl',
          'type.name as linkType'
        ])
        .orderBy('project.title_en', 'ASC')
        .getRawMany();
    } catch (error) {
      throw new BadRequestException('Error fetching project-link statistics: ' + error.message);
    }
  }

  async getMostUsedLinksInProjects(limit: number = 10): Promise<any[]> {
    try {
      return await this.projectsLinkRepository
        .createQueryBuilder('projectsLink')
        .leftJoin('projectsLink.link_id', 'link')
        .leftJoin('link.type', 'type')
        .select([
          'link.id_link',
          'link.link as linkUrl',
          'type.name as linkType',
          'COUNT(projectsLink.id_project_link) as projectCount'
        ])
        .groupBy('link.id_link')
        .addGroupBy('link.link')
        .addGroupBy('type.name')
        .orderBy('projectCount', 'DESC')
        .limit(limit)
        .getRawMany();
    } catch (error) {
      throw new BadRequestException('Error fetching most used links in projects: ' + error.message);
    }
  }
}
