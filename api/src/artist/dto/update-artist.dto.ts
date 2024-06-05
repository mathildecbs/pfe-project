import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsArray } from 'class-validator';

export class UpdateArtistDto {
  @IsArray()
  groups: string[]
}
