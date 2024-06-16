import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsArray, IsString } from 'class-validator';

export class UpdateArtistDto {
  @IsArray()
  groups: string[]

  @IsString()
  image: string
}
