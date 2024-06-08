import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDateString()
  release_date: string

  @IsBoolean()
  solo: boolean

  @IsUUID()
  artist?: string

  @IsUUID()
  group?: string

  @IsArray()
  version?: string[]

}
