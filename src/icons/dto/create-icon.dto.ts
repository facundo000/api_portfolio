import { IsNotEmpty, IsUUID, IsString, Matches } from 'class-validator';

export class CreateIconDto {
  @IsNotEmpty()
  @IsUUID()
  type_icon_id: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^<svg[\s\S]*<\/svg>$/, {
    message: 'Icon must be a valid SVG element'
  })
  icon: string;
}
