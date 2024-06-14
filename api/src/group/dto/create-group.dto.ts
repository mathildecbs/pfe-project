import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  company: string

  @IsString()
  parent?: string

  @IsString()
  image: string


}
