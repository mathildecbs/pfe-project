import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOwnedAlbumDto {

  @IsNotEmpty()
  @IsInt()
  quantity: number

  @IsString()
  version?:string

  @IsUUID()
  @IsNotEmpty()
  album: string
}
