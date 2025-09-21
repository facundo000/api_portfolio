import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIconDto } from './dto/create-icon.dto';
import { UpdateIconDto } from './dto/update-icon.dto';
import { Icon } from './entities/icon.entity';

@Injectable()
export class IconsService {
  constructor(
    @InjectRepository(Icon)
    private readonly iconRepository: Repository<Icon>,
  ) {}

  async create(createIconDto: CreateIconDto): Promise<Icon> {
    const { type_icon_id, icon } = createIconDto;

    // Validate SVG content
    if (!this.isValidSVG(icon)) {
      throw new BadRequestException('Invalid SVG format provided');
    }

    const newIcon = this.iconRepository.create(createIconDto);
    return await this.iconRepository.save(newIcon);
  }

  async findAll(): Promise<Icon[]> {
    return await this.iconRepository.find({
      relations: ['type_icon_id', 'projectsIcons'],
    });
  }

  async findOne(id: string): Promise<Icon> {
    const icon = await this.iconRepository.findOne({
      where: { id_icon: id },
      relations: ['type_icon_id', 'projectsIcons'],
    });

    if (!icon) {
      throw new NotFoundException(`Icon with ID ${id} not found`);
    }

    return icon;
  }

  async findByType(typeId: string): Promise<Icon[]> {
    return await this.iconRepository.find({
      where: { type_icon_id: typeId },
      relations: ['type_icon_id', 'projectsIcons'],
    });
  }

  async update(id: string, updateIconDto: UpdateIconDto): Promise<Icon> {
    const icon = await this.findOne(id);

    // Validate SVG content if provided
    if (updateIconDto.icon && !this.isValidSVG(updateIconDto.icon)) {
      throw new BadRequestException('Invalid SVG format provided');
    }

    Object.assign(icon, updateIconDto);
    return await this.iconRepository.save(icon);
  }

  async remove(id: string): Promise<void> {
    const icon = await this.findOne(id);
    await this.iconRepository.remove(icon);
  }

  async removeByType(typeId: string): Promise<void> {
    const icons = await this.findByType(typeId);
    await this.iconRepository.remove(icons);
  }

  private isValidSVG(svgContent: string): boolean {
    // Basic SVG validation
    const svgRegex = /^<svg[\s\S]*<\/svg>$/i;
    return svgRegex.test(svgContent.trim());
  }

  async searchIcons(searchTerm: string): Promise<Icon[]> {
    return await this.iconRepository
      .createQueryBuilder('icon')
      .leftJoinAndSelect('icon.type_icon_id', 'type')
      .leftJoinAndSelect('icon.projectsIcons', 'projectsIcons')
      .where('icon.icon ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('type.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .getMany();
  }
}
