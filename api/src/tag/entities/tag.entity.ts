import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';

@Entity()
export class Tag extends BaseEntity {
  @Column({type:'varchar', nullable: false, unique:true})
  name: string
}
