import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateOwnedAlbumDto {

  @IsNotEmpty()
  @IsInt()
  quantity: number

  @IsString()
  version?:string

}
