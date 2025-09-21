import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectsLinkDto } from './create-projects_link.dto';

export class UpdateProjectsLinkDto extends PartialType(CreateProjectsLinkDto) {}
