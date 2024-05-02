import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
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
  likes: User[]

  @ManyToMany(()=>User, (user)=> user.reposts)
  reposts: User[]

  @ManyToOne(()=> Tag)
  tags: Tag[]
}
