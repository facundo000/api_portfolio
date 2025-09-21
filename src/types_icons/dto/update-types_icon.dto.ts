import { PartialType } from '@nestjs/mapped-types';
import { CreateTypesIconDto } from './create-types_icon.dto';

export class UpdateTypesIconDto extends PartialType(CreateTypesIconDto) {}
