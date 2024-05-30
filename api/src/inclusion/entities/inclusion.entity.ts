import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity, IncluEnum } from '../../utils/base_entity/base_entity.service';
import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';

@Entity()
export class Inclusion extends BaseEntity{

  @Column()
  name: string

  @ManyToOne(()=> Album, (album)=> album.inclusions, {nullable:false, onDelete:"CASCADE"})
  album: Album

  @ManyToOne(()=> Artist, (artist)=> artist.inclusions, {nullable: true, eager: true, onDelete:"CASCADE"})
  member: Artist

  @Column({type:'enum', enum: IncluEnum, default: IncluEnum.PHOTOCARD})
  type: IncluEnum

}
