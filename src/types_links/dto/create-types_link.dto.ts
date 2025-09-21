import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTypesLinkDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MaxLength(255, { message: 'Name must not exceed 255 characters' })
    name: string;
}
