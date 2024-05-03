import { Column, Entity, JoinTable, ManyToMany, ManyToOne, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { User } from '../../user/entities/user.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity()
@Tree("materialized-path")
export class Post extends BaseEntity{

  @Column({type: 'text', nullable: false})
  content: string

  @ManyToOne(()=> User, (user)=> user.posts)
  user: User

  @TreeParent()
  parent: Post

  @TreeChildren()
  children: Post[]

  @ManyToMany(()=>User, (user)=> user.likes)
  @JoinTable()
  likes: User[]

  @ManyToMany(()=>User, (user)=> user.reposts)
  @JoinTable()
  reposts: User[]

  @ManyToMany(()=> Tag, (tag)=> tag.posts)
  tags: Tag[]
}
