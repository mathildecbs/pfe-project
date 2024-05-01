import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { User } from '../../user/entities/user.entity';
import { Inclusion } from './inclusion.entity';

@Entity()
export class OwnedInclusion extends BaseEntity{

  @Column({type:'int', default:1, nullable:false})
  quantity: number

  @ManyToOne(()=> User, (user)=> user.inclusions)
  user: User

  @ManyToOne(()=> Inclusion)
  inclusion: Inclusion

}
