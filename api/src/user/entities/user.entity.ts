import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { OwnedInclusion } from '../../inclusion/entities/owned-inclusion.entity';
import { OwnedAlbum } from '../../album/entities/owned-album.entity';
import { Post } from '../../post/entities/post.entity';

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

  @Column({nullable:false, default: false})
  isAdmin: boolean

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable()
  following: User[];

  @ManyToMany(() => User, (user) => user.following)
  followers: User[];

  @OneToMany(()=> OwnedInclusion, (inclusion)=> inclusion.user)
  inclusions: OwnedInclusion[]

  @OneToMany(()=> OwnedAlbum, (album)=> album.user)
  albums: OwnedAlbum[]

  @OneToMany(()=> Post, (post)=> post.user)
  posts: Post[]

  @ManyToMany(()=> Post, (post)=> post.likes)
  likes: Post[]

  @ManyToMany(()=> Post, (post)=> post.reposts)
  reposts: Post[]

}
