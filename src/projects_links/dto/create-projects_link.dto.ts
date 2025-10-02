import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectsLinkDto {
    @IsNotEmpty({ message: 'Project ID is required' })
    @IsUUID('4', { message: 'Project ID must be a valid UUID' })
    project_id?: string;

    @IsNotEmpty({ message: 'Link ID is required' })
    @IsUUID('4', { message: 'Link ID must be a valid UUID' })
    link_id?: string;
}
