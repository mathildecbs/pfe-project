import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { Artist } from '../../artist/entities/artist.entity';
import { Group } from '../../group/entities/group.entity';
import { Inclusion } from '../../inclusion/entities/inclusion.entity';

@Entity()
export class Album extends BaseEntity{
  @Column()
  name: string

  @Column({type: 'date'})
  release_date: string

  @Column({type:'boolean', default: false})
  solo: boolean

  @ManyToOne(()=> Artist, (artist)=> artist.albums, {onDelete: "CASCADE"})
  artist: Artist

  @ManyToOne(()=> Group, (group)=> group.albums, {onDelete: "CASCADE"})
  group: Group

  @Column('json', { nullable:true })
  versions: string[];

  @OneToMany(()=> Inclusion, (inclusion)=> inclusion.album)
  inclusions: Inclusion[]

}
