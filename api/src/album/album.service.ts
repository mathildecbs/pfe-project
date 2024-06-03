import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Like, Repository } from 'typeorm';
import { ArtistService } from '../artist/artist.service';
import { GroupService } from '../group/group.service';
import { BaseQP } from '../utils/base_entity/base_entity.service';

@Injectable()
export class AlbumService {
  
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private artistService: ArtistService,
    private groupService: GroupService
    
  ) {
  }
  async create(createAlbumDto: CreateAlbumDto) {

    const new_album = {
      ...createAlbumDto,
      group: null,
      artist: null
    }

    if (createAlbumDto.solo) {
      new_album.artist = await this.artistService.findOne(createAlbumDto.artist)
    } else {
      new_album.group = await this.groupService.findOne(createAlbumDto.group)
    }

    const res = await this.albumRepository.save(new_album)

    if( !res ) {
      throw new HttpException(`Creation failed `, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(res.id);
  }

  async findAll(query: BaseQP) {
    const options = {
    }
    if (query.limit) options['take'] = query.limit
    if (query.limit&& query.offset) options['skip'] = query.offset
    if (query.search) {
      options['where'] = {}
      options['where']['name'] = Like(`${query.search}%`)
    }

    return await this.albumRepository.find({
      ...options,
      order : {
        release_date: "desc"
      }
    });
  }

  async findOne(id: string) {
    const res = await this.albumRepository.find({
      where: { id },
      relations: {
        inclusions: true,
        artist: true,
        group: true
      }
    })

    if (res.length === 0) {
      throw new HttpException(`album ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return res[0];
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id)
    const update_album = {
      ...album,
      ...updateAlbumDto,
      artist: album.artist,
      group: album.group,
      solo: album.solo
    }

    if(updateAlbumDto.solo && updateAlbumDto.artist) {
      update_album.artist = await this.artistService.findOne(updateAlbumDto.artist)
      update_album.solo = true
      update_album.group = null
    }
    if(!updateAlbumDto.solo && updateAlbumDto.group) {
      update_album.group = await this.groupService.findOne(updateAlbumDto.group)
      update_album.solo = false
      update_album.artist = null
    }

    const res = await this.albumRepository.save(update_album)

    if( !res ) {
      throw new HttpException(`Update failed for album ${id}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(res.id);  }

  async remove(id: string) {
    const album = await this.findOne(id)
    try {
      const res = await this.albumRepository.delete(album.id)
      return true;
    } catch (e: any) {
      throw new HttpException(`Fail on delete album ${id} : ${e}`, HttpStatus.BAD_REQUEST)

    }
  }
}
