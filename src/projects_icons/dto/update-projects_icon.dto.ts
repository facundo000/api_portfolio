import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectsIconDto } from './create-projects_icon.dto';

export class UpdateProjectsIconDto extends PartialType(CreateProjectsIconDto) {}
