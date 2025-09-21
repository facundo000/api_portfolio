import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypesIconDto } from './dto/create-types_icon.dto';
import { UpdateTypesIconDto } from './dto/update-types_icon.dto';
import { TypesIcon } from './entities/types_icon.entity';

@Injectable()
export class TypesIconsService {
  constructor(
    @InjectRepository(TypesIcon)
    private readonly typesIconRepository: Repository<TypesIcon>,
  ) {}

  async create(createTypesIconDto: CreateTypesIconDto): Promise<TypesIcon> {
    const { name } = createTypesIconDto;

    // Check if type already exists
    const existingType = await this.typesIconRepository.findOne({
      where: { name: name.toLowerCase().trim() },
    });

    if (existingType) {
      throw new ConflictException('Icon type with this name already exists');
    }

    const typesIcon = this.typesIconRepository.create({
      ...createTypesIconDto,
      name: name.toLowerCase().trim(),
    });

    return await this.typesIconRepository.save(typesIcon);
  }

  async findAll(): Promise<TypesIcon[]> {
    return await this.typesIconRepository.find({
      relations: ['icons'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TypesIcon> {
    const typesIcon = await this.typesIconRepository.findOne({
      where: { id_type_icon: id },
      relations: ['icons'],
    });

    if (!typesIcon) {
      throw new NotFoundException(`Icon type with ID ${id} not found`);
    }

    return typesIcon;
  }

  async findByName(name: string): Promise<TypesIcon> {
    const typesIcon = await this.typesIconRepository.findOne({
      where: { name: name.toLowerCase().trim() },
      relations: ['icons'],
    });

    if (!typesIcon) {
      throw new NotFoundException(`Icon type with name "${name}" not found`);
    }

    return typesIcon;
  }

  async update(id: string, updateTypesIconDto: UpdateTypesIconDto): Promise<TypesIcon> {
    const typesIcon = await this.findOne(id);

    // If updating name, check for duplicates
    if (updateTypesIconDto.name) {
      const existingType = await this.typesIconRepository.findOne({
        where: { name: updateTypesIconDto.name.toLowerCase().trim() },
      });

      if (existingType && existingType.id_type_icon !== id) {
        throw new ConflictException('Icon type with this name already exists');
      }
    }

    Object.assign(typesIcon, {
      ...updateTypesIconDto,
      name: updateTypesIconDto.name?.toLowerCase().trim() || typesIcon.name,
    });

    return await this.typesIconRepository.save(typesIcon);
  }

  async remove(id: string): Promise<void> {
    const typesIcon = await this.findOne(id);

    // Check if there are associated icons
    if (typesIcon.icons && typesIcon.icons.length > 0) {
      throw new ConflictException('Cannot delete icon type that has associated icons');
    }

    await this.typesIconRepository.remove(typesIcon);
  }

  async getStats(): Promise<{ typeId: string; name: string; iconCount: number }[]> {
    return await this.typesIconRepository
      .createQueryBuilder('type')
      .leftJoin('type.icons', 'icon')
      .select([
        'type.id_type_icon as "typeId"',
        'type.name as name',
        'COUNT(icon.id_icon) as "iconCount"',
      ])
      .groupBy('type.id_type_icon, type.name')
      .orderBy('type.name', 'ASC')
      .getRawMany();
  }
}
