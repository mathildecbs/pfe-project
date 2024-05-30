import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';
import { ArtistService } from '../artist/artist.service';
import { GroupService } from '../group/group.service';

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

  async findAll() {
    return await this.albumRepository.find();
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

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

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
