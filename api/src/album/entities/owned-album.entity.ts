import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/base_entity/base_entity.service';
import { User } from '../../user/entities/user.entity';
import { Album } from './album.entity';

@Entity()
export class OwnedAlbum extends BaseEntity{
  @Column({type:'int', default:1, nullable:false})
  quantity: number

  @Column({type: 'varchar', nullable:true})
  version: string

  @ManyToOne(()=> User, (user)=> user.albums, {onDelete: "CASCADE"})
  user: User

  @ManyToOne(()=> Album, {eager: true, onDelete: "CASCADE"})
  album: Album


}
