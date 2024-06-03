import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { Group } from '../../group/entities/group.entity';
import { Album } from '../../album/entities/album.entity';
import { Inclusion } from '../../inclusion/entities/inclusion.entity';

@Entity()
export class Artist extends BaseEntity{
  @Column()
  name: string

  @Column({type: "date", nullable: true})
  birthday: string

  @ManyToOne(()=> Group, {onDelete: "CASCADE", eager: true})
  main_group: Group

  @ManyToMany(()=> Group, (group)=> group.members, {onDelete: "CASCADE"})
  groups: Group[]

  @OneToMany(()=> Album, (album)=> album.artist, {onDelete: "CASCADE"})
  albums: Album[]

  @OneToMany(()=> Inclusion, (inclusion)=> inclusion.member, {onDelete: "CASCADE"})
  inclusions: Inclusion[]
}
