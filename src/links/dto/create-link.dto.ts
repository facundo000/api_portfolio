import { IsNotEmpty, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';

export class CreateLinkDto {
    @IsNotEmpty({ message: 'Link URL is required' })
    @IsString({ message: 'Link must be a string' })
    @IsUrl({}, { message: 'Link must be a valid URL' })
    @MaxLength(500, { message: 'Link must not exceed 500 characters' })
    link: string;

    @IsNotEmpty({ message: 'Type ID is required' })
    @IsUUID('4', { message: 'Type ID must be a valid UUID' })
    type_id: string;
}
