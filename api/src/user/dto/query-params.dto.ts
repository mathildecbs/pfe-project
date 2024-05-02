import { BaseQP } from '../../utils/base_entity/base_entity.service';
import { IsDateString, IsString } from 'class-validator';

export class UserQP extends BaseQP{
  @IsDateString()
  create_date:string

  @IsString()
  search: string
}
