import { BaseQP } from '../../utils/base_entity/base_entity.service';
import { IsDateString } from 'class-validator';

export class UserQP extends BaseQP{
  @IsDateString()
  create_date:string
}
