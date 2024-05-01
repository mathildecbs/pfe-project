import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';

@Entity()
export class Group extends BaseEntity {
  @Column()
  name: string

  @ManyToMany(()=> Artist, (member)=> member.groups)
  @JoinTable()
  members: Artist[]

  @ManyToOne(()=> Group, (parent)=> parent.children)
  parent: Group

  @OneToMany(()=> Group, (child)=> child.parent)
  children: Group[]

  @OneToMany(()=>Album, (album)=> album.group)
  albums: Album[]
}
