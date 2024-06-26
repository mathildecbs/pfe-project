import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { User } from '../../user/entities/user.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Repost } from "./repost.entity";

@Entity()
@Tree("materialized-path")
export class Post extends BaseEntity{

  @Column({type: 'text', nullable: false})
  content: string

  @ManyToOne(()=> User, (user)=> user.posts, {eager: true, onDelete:"CASCADE"})
  user: User

  @Column({type:"boolean"})
  comment: boolean

  @TreeParent({onDelete: "CASCADE"})
  parent: Post

  @TreeChildren()
  children: Post[]

  @ManyToMany(()=>User, (user)=> user.likes)
  @JoinTable()
  likes: User[]

  @OneToMany(()=>Repost, (repost)=> repost.post)
  reposts: User[]

  @ManyToMany(()=> Tag, (tag)=> tag.posts)
  tags: Tag[]

  @Column({type: "varchar", nullable: true, default: null})
  image: string
}
