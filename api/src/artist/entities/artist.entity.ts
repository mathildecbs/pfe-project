import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { Group } from '../../group/entities/group.entity';
import { Album } from '../../album/entities/album.entity';
import { Inclusion } from '../../inclusion/entities/inclusion.entity';

@Entity()
export class Artist extends BaseEntity{
  @Column()
  name: string

  @ManyToMany(()=> Group, (group)=> group.members)
  groups: Group[]

  @OneToMany(()=> Album, (album)=> album.artist)
  albums: Album[]

  @OneToMany(()=> Inclusion, (inclusion)=> inclusion.member)
  inclusions: Inclusion[]
}
