import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {

  @IsNotEmpty()
  @IsString()
  name: string

  @IsArray()
  groups: Array<string>
}
