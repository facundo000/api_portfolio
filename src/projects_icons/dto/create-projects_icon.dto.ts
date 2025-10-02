import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectsIconDto {
  @IsNotEmpty()
  @IsUUID()
  project_id?: string;

  @IsNotEmpty()
  @IsUUID()
  icon_id?: string;
}
