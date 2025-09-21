import { IsNotEmpty, IsString, IsOptional, MaxLength, IsUrl, IsUUID } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty({ message: 'Title in English is required' })
    @IsString({ message: 'Title in English must be a string' })
    @MaxLength(255, { message: 'Title in English must not exceed 255 characters' })
    title_en: string;

    @IsNotEmpty({ message: 'Title in Spanish is required' })
    @IsString({ message: 'Title in Spanish must be a string' })
    @MaxLength(255, { message: 'Title in Spanish must not exceed 255 characters' })
    title_es: string;

    @IsNotEmpty({ message: 'Description in English is required' })
    @IsString({ message: 'Description in English must be a string' })
    @MaxLength(1000, { message: 'Description in English must not exceed 1000 characters' })
    description_en: string;

    @IsNotEmpty({ message: 'Description in Spanish is required' })
    @IsString({ message: 'Description in Spanish must be a string' })
    @MaxLength(1000, { message: 'Description in Spanish must not exceed 1000 characters' })
    description_es: string;

    @IsOptional()
    @IsString({ message: 'GIF URL must be a string' })
    @IsUrl({}, { message: 'GIF must be a valid URL' })
    gif?: string;

    @IsOptional()
    @IsString({ message: 'Image URL must be a string' })
    @IsUrl({}, { message: 'Image must be a valid URL' })
    img?: string;

    @IsNotEmpty({ message: 'User ID is required' })
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    user_id: string;

}
