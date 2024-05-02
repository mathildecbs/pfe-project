import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { User } from '../../user/entities/user.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity()
export class Post extends BaseEntity{

  @Column({type: 'text', nullable: false})
  content: string

  @ManyToOne(()=> User, (user)=> user.posts)
  user: User

  @ManyToMany(()=>User, (user)=> user.likes)
  @JoinTable()
  likes: User[]

  @ManyToMany(()=>User, (user)=> user.reposts)
  @JoinTable()
  reposts: User[]

  @ManyToMany(()=> Tag, (tag)=> tag.posts)
  tags: Tag[]
}
