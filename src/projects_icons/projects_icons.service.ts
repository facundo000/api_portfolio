import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectsIconDto } from './dto/create-projects_icon.dto';
import { UpdateProjectsIconDto } from './dto/update-projects_icon.dto';
import { ProjectsIcon } from './entities/projects_icon.entity';

@Injectable()
export class ProjectsIconsService {
  constructor(
    @InjectRepository(ProjectsIcon)
    private readonly projectsIconRepository: Repository<ProjectsIcon>,
  ) {}

  async create(createProjectsIconDto: CreateProjectsIconDto): Promise<ProjectsIcon> {
    const { project_id, icon_id } = createProjectsIconDto;

    // Verificar si ya existe esta relación
    const existingRelation = await this.projectsIconRepository.findOne({
      where: {
        project_id,
        icon_id,
      },
    });

    if (existingRelation) {
      throw new ConflictException('Esta relación proyecto-icono ya existe');
    }

    const projectsIcon = this.projectsIconRepository.create(createProjectsIconDto);
    return await this.projectsIconRepository.save(projectsIcon);
  }

  async findAll(): Promise<ProjectsIcon[]> {
    return await this.projectsIconRepository.find({
      relations: ['project', 'icon'],
    });
  }

  async findOne(id: string): Promise<ProjectsIcon> {
    const projectsIcon = await this.projectsIconRepository.findOne({
      where: { id_project_icon: id },
      relations: ['project', 'icon'],
    });

    if (!projectsIcon) {
      throw new NotFoundException(`Relación proyecto-icono con ID ${id} no encontrada`);
    }

    return projectsIcon;
  }

  async findByProject(projectId: string): Promise<ProjectsIcon[]> {
    return await this.projectsIconRepository.find({
      where: { project_id: projectId },
      relations: ['project_id', 'icon_id'],
    });
  }

  async findByIcon(iconId: string): Promise<ProjectsIcon[]> {
    return await this.projectsIconRepository.find({
      where: { icon_id: iconId },
      relations: ['project_id', 'icon_id'],
    });
  }

  async update(id: string, updateProjectsIconDto: UpdateProjectsIconDto): Promise<ProjectsIcon> {
    const projectsIcon = await this.findOne(id);

    // Si se está actualizando la relación, verificar que no exista duplicado
    if (updateProjectsIconDto.project_id && updateProjectsIconDto.icon_id) {
      const existingRelation = await this.projectsIconRepository.findOne({
        where: {
          project_id: updateProjectsIconDto.project_id,
          icon_id: updateProjectsIconDto.icon_id,
        },
      });

      if (existingRelation && existingRelation.id_project_icon !== id) {
        throw new ConflictException('Esta relación proyecto-icono ya existe');
      }
    }

    Object.assign(projectsIcon, updateProjectsIconDto);
    return await this.projectsIconRepository.save(projectsIcon);
  }

  async remove(id: string): Promise<void> {
    const projectsIcon = await this.findOne(id);
    await this.projectsIconRepository.remove(projectsIcon);
  }

  async removeByProject(projectId: string): Promise<void> {
    const relations = await this.findByProject(projectId);
    await this.projectsIconRepository.remove(relations);
  }

  async removeByIcon(iconId: string): Promise<void> {
    const relations = await this.findByIcon(iconId);
    await this.projectsIconRepository.remove(relations);
  }
}
