import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  user: string

  @IsString()
  parent?: string

  @IsArray()
  tags: string[]

  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  image: string
}
