import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypesLinkDto } from './dto/create-types_link.dto';
import { UpdateTypesLinkDto } from './dto/update-types_link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypesLink } from './entities/types_link.entity';

@Injectable()
export class TypesLinksService {

  constructor(
    @InjectRepository(TypesLink)
    private readonly typeRepository: Repository<TypesLink>,
  ) {}

  async create(createTypesLinkDto: CreateTypesLinkDto): Promise<TypesLink> {
    try {
      // Verificar si ya existe un tipo con el mismo nombre
      const existingType = await this.typeRepository.findOne({
        where: { name: createTypesLinkDto.name }
      });

      if (existingType) {
        throw new BadRequestException(`Type with name '${createTypesLinkDto.name}' already exists`);
      }

      // Crear nueva instancia del tipo
      const newType = this.typeRepository.create(createTypesLinkDto);
      
      // Guardar en la base de datos
      return await this.typeRepository.save(newType);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error creating type: ' + error.message);
    }
  }

  async findAll(): Promise<TypesLink[]> {
    try {
      return await this.typeRepository.find({
        relations: ['links'], // Relación con los links
        order: {
          name: 'ASC' // Ordenar por nombre
        }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching types: ' + error.message);
    }
  }

  async findOne(id: string): Promise<TypesLink> {
    try {
      const type = await this.typeRepository.findOne({
        where: { type_id: id },
        relations: ['links'] // Incluir los links relacionados
      });

      if (!type) {
        throw new NotFoundException(`Type with ID ${id} not found`);
      }

      return type;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching type: ' + error.message);
    }
  }

  async update(id: string, updateTypesLinkDto: UpdateTypesLinkDto): Promise<TypesLink> {
    try {
      // Verificar si el tipo existe
      const existingType = await this.findOne(id);

      // Si se está actualizando el nombre, verificar que no exista otro tipo con ese nombre
      if (updateTypesLinkDto.name && updateTypesLinkDto.name !== existingType.name) {
        const typeWithSameName = await this.typeRepository.findOne({
          where: { name: updateTypesLinkDto.name }
        });

        if (typeWithSameName && typeWithSameName.type_id !== id) {
          throw new BadRequestException(`Type with name '${updateTypesLinkDto.name}' already exists`);
        }
      }

      // Actualizar los campos
      await this.typeRepository.update(id, updateTypesLinkDto);

      // Retornar el tipo actualizado
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error updating type: ' + error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      // Verificar si el tipo existe
      const type = await this.findOne(id);

      // Verificar si el tipo tiene links asociados
      const linksCount = await this.typeRepository
        .createQueryBuilder('typesLink')
        .leftJoin('typesLink.links', 'link')
        .where('typesLink.type_id = :id', { id })
        .getCount();

      if (linksCount > 0) {
        throw new BadRequestException('Cannot delete type: it has associated links');
      }

      // Eliminar el tipo
      await this.typeRepository.remove(type);

      return { message: `Type with ID ${id} has been successfully deleted` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error deleting type: ' + error.message);
    }
  }

  // Métodos adicionales útiles

  async findByName(name: string): Promise<TypesLink | null> {
    try {
      return await this.typeRepository.findOne({
        where: { name },
        relations: ['links']
      });
    } catch (error) {
      throw new BadRequestException('Error fetching type by name: ' + error.message);
    }
  }

  async getTypesWithLinkCount(): Promise<any[]> {
    try {
      return await this.typeRepository
        .createQueryBuilder('typesLink')
        .leftJoin('typesLink.links', 'link')
        .select([
          'typesLink.type_id',
          'typesLink.name',
          'COUNT(link.id_link) as linkCount'
        ])
        .groupBy('typesLink.type_id')
        .addGroupBy('typesLink.name')
        .getRawMany();
    } catch (error) {
      throw new BadRequestException('Error fetching types with link count: ' + error.message);
    }
  }

  async findTypesForProject(projectId: string): Promise<TypesLink[]> {
    try {
      return await this.typeRepository
        .createQueryBuilder('typesLink')
        .innerJoin('typesLink.links', 'link')
        .innerJoin('link.projectLinks', 'projectLink')
        .innerJoin('projectLink.project_id', 'project')
        .where('project.id_project = :projectId', { projectId })
        .distinct(true)
        .getMany();
    } catch (error) {
      throw new BadRequestException('Error fetching types for project: ' + error.message);
    }
  }
}
