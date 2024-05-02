import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Tag extends BaseEntity {
  @Column({type:'varchar', nullable: false, unique:true})
  name: string

  @ManyToMany(()=> Post, (post)=> post.tags)
  @JoinTable()
  posts : Post[]
}
