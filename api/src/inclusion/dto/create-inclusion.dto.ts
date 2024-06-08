import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IncluEnum } from '../../utils/base_entity/base_entity.service';

export class CreateInclusionDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  album: string

  @IsString()
  member?: string

  @IsEnum(IncluEnum)
  type: IncluEnum


}
