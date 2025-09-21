import { IsString, MinLength } from "class-validator";


export class CreateUserDto {
    @IsString()
    @MinLength(2)
    username: string;

    @IsString()
    @MinLength(5)
    password: string
}
