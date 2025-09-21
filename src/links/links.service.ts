import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { TypesLink } from '../types_links/entities/types_link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(TypesLink)
    private readonly typesLinkRepository: Repository<TypesLink>,
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<Link> {
    try {
      // Verificar si el tipo de link existe
      const typeExists = await this.typesLinkRepository.findOne({
        where: { type_id: createLinkDto.type_id }
      });

      if (!typeExists) {
        throw new BadRequestException(`Type with ID '${createLinkDto.type_id}' not found`);
      }

      // Verificar si ya existe un link con la misma URL y tipo
      const existingLink = await this.linkRepository.findOne({
        where: { 
          link: createLinkDto.link,
          type_id: createLinkDto.type_id 
        }
      });

      if (existingLink) {
        throw new BadRequestException(`Link with URL '${createLinkDto.link}' and type '${createLinkDto.type_id}' already exists`);
      }

      // Crear nueva instancia del link
      const newLink = this.linkRepository.create(createLinkDto);
      
      // Guardar en la base de datos
      const savedLink = await this.linkRepository.save(newLink);
      
      // Retornar con relaciones
      return await this.findOne(savedLink.id_link);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error creating link: ' + error.message);
    }
  }

  async findAll(): Promise<Link[]> {
    try {
      return await this.linkRepository.find({
        relations: ['type', 'projectLinks'],
        order: {
          link: 'ASC'
        }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching links: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Link> {
    try {
      const link = await this.linkRepository.findOne({
        where: { id_link: id },
        relations: ['type', 'projectLinks']
      });

      if (!link) {
        throw new NotFoundException(`Link with ID ${id} not found`);
      }

      return link;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching link: ' + error.message);
    }
  }

  async update(id: string, updateLinkDto: UpdateLinkDto): Promise<Link> {
    try {
      // Verificar si el link existe
      const existingLink = await this.findOne(id);

      // Si se está actualizando el tipo, verificar que exista
      if (updateLinkDto.type_id && updateLinkDto.type_id !== existingLink.type_id) {
        const typeExists = await this.typesLinkRepository.findOne({
          where: { type_id: updateLinkDto.type_id }
        });

        if (!typeExists) {
          throw new BadRequestException(`Type with ID '${updateLinkDto.type_id}' not found`);
        }
      }

      // Si se está actualizando la URL o el tipo, verificar que no exista otro link igual
      if ((updateLinkDto.link || updateLinkDto.type_id) && 
          (updateLinkDto.link !== existingLink.link || updateLinkDto.type_id !== existingLink.type_id)) {
        
        const linkToCheck = await this.linkRepository.findOne({
          where: { 
            link: updateLinkDto.link || existingLink.link,
            type_id: updateLinkDto.type_id || existingLink.type_id
          }
        });

        if (linkToCheck && linkToCheck.id_link !== id) {
          throw new BadRequestException(`Link with URL '${updateLinkDto.link || existingLink.link}' and type '${updateLinkDto.type_id || existingLink.type_id}' already exists`);
        }
      }

      // Actualizar los campos
      await this.linkRepository.update(id, updateLinkDto);

      // Retornar el link actualizado
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error updating link: ' + error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      // Verificar si el link existe
      const link = await this.findOne(id);

      // Verificar si el link tiene proyectos asociados
      const projectsCount = await this.linkRepository
        .createQueryBuilder('link')
        .leftJoin('link.projectLinks', 'projectLink')
        .where('link.id_link = :id', { id })
        .getCount();

      if (projectsCount > 0) {
        throw new BadRequestException('Cannot delete link: it has associated projects');
      }

      // Eliminar el link
      await this.linkRepository.remove(link);

      return { message: `Link with ID ${id} has been successfully deleted` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error deleting link: ' + error.message);
    }
  }

  // Métodos adicionales útiles

  async findByType(typeId: string): Promise<Link[]> {
    try {
      return await this.linkRepository.find({
        where: { type_id: typeId },
        relations: ['type', 'projectLinks'],
        order: { link: 'ASC' }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching links by type: ' + error.message);
    }
  }

  async findByUrl(url: string): Promise<Link | null> {
    try {
      return await this.linkRepository.findOne({
        where: { link: url },
        relations: ['type', 'projectLinks']
      });
    } catch (error) {
      throw new BadRequestException('Error fetching link by URL: ' + error.message);
    }
  }

  async getLinksWithProjectCount(): Promise<any[]> {
    try {
      return await this.linkRepository
        .createQueryBuilder('link')
        .leftJoin('link.projectLinks', 'projectLink')
        .leftJoin('link.type', 'type')
        .select([
          'link.id_link',
          'link.link',
          'type.name as typeName',
          'COUNT(projectLink.id_project_link) as projectCount'
        ])
        .groupBy('link.id_link')
        .addGroupBy('link.link')
        .addGroupBy('type.name')
        .orderBy('projectCount', 'DESC')
        .getRawMany();
    } catch (error) {
      throw new BadRequestException('Error fetching links with project count: ' + error.message);
    }
  }

  async findLinksForProject(projectId: string): Promise<Link[]> {
    try {
      return await this.linkRepository
        .createQueryBuilder('link')
        .innerJoin('link.projectLinks', 'projectLink')
        .where('projectLink.project_id = :projectId', { projectId })
        .leftJoinAndSelect('link.type', 'type')
        .orderBy('link.link', 'ASC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('Error fetching links for project: ' + error.message);
    }
  }

  async findMostUsedLinks(limit: number = 10): Promise<any[]> {
    try {
      return await this.linkRepository
        .createQueryBuilder('link')
        .leftJoin('link.projectLinks', 'projectLink')
        .leftJoin('link.type', 'type')
        .select([
          'link.id_link',
          'link.link',
          'type.name as typeName',
          'COUNT(projectLink.id_project_link) as usageCount'
        ])
        .groupBy('link.id_link')
        .addGroupBy('link.link')
        .addGroupBy('type.name')
        .orderBy('usageCount', 'DESC')
        .limit(limit)
        .getRawMany();
    } catch (error) {
      throw new BadRequestException('Error fetching most used links: ' + error.message);
    }
  }
}
