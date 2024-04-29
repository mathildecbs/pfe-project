import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';

@Entity()
export class User extends BaseEntity {
  @Column( {unique: true, nullable: false})
  username: string

  @Column({ nullable: false})
  password: string

  @Column({nullable:false})
  name: string

  @Column({nullable:true})
  description: string

  @ManyToMany(() => User)
  @JoinTable()
  following: User[]
}
