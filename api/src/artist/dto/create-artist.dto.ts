import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateArtistDto {

  @IsNotEmpty()
  @IsString()
  name: string

  @IsUUID()
  @IsNotEmpty()
  main_group: string

  @IsArray()
  groups: Array<string>

  @IsString()
  image: string
}
