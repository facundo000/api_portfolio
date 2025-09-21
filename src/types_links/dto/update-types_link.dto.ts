import { PartialType } from '@nestjs/mapped-types';
import { CreateTypesLinkDto } from './create-types_link.dto';

export class UpdateTypesLinkDto extends PartialType(CreateTypesLinkDto) {}
