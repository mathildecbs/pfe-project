import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';

@Entity()
@Tree("materialized-path")
export class Group extends BaseEntity {
  @Column()
  name: string

  @Column()
  company: string

  @ManyToMany(()=> Artist, (member)=> member.groups)
  @JoinTable()
  members: Artist[]

  @TreeParent({onDelete: "CASCADE"})
  parent: Group

  @TreeChildren()
  children: Group[]

  @OneToMany(()=>Album, (album)=> album.group)
  albums: Album[]

  @Column({type: "varchar", nullable: true, default: null})
  image: string
}
