import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { GroupService } from '../group/group.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private groupService: GroupService
  ) {
  }
  async create(createArtistDto: CreateArtistDto) {
    const new_artist = {
      ...createArtistDto,
      groups: []
    }

    if (createArtistDto.groups) {
      for (const group of createArtistDto.groups) {
        new_artist.groups.push(await this.groupService.findOne(group))
      }
    }

    const res = await this.artistRepository.save(new_artist)

    if( !res ) {
      throw new HttpException(`Creation failed `, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(res.id);
  }

  async findAll() {
    return await this.artistRepository.find();
  }

  async findOne(id: string) {

    const res = await this.artistRepository.find({
      where : {id},
      relations: {
        groups: true,
        albums: true,
        inclusions: true
      }
    })

    if(res.length===0 ) {
      throw new HttpException(`artist ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return res[0];

  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id)

    for (const group of updateArtistDto.groups) {
      const added_group = await this.groupService.findOne(group)
      artist.groups.push(added_group)
    }

    const res = await this.artistRepository.save(artist)

    if( !res ) {
      throw new HttpException(`Update failed for group ${id}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(res.id);
  }

  async remove(id: string) {
    const artist = await this.findOne(id)
    try {
      const res = await this.artistRepository.delete(artist.id)
      return true;
    } catch (e: any) {
      throw new HttpException(`Fail on delete artist ${id} : ${e}`, HttpStatus.BAD_REQUEST)

    }
  }
}
