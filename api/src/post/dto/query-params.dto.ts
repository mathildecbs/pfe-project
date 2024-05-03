import { BaseQP } from '../../utils/base_entity/base_entity.service';
import { IsDateString, IsString } from 'class-validator';

export class PostQP extends BaseQP{
  @IsString()
  search: string
}
