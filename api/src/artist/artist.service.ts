import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Like, Repository } from 'typeorm';
import { GroupService } from '../group/group.service';
import { BaseQP } from '../utils/base_entity/base_entity.service';

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
      groups: [],
      main_group: null
    }

    new_artist.main_group = await this.groupService.findOne(createArtistDto.main_group)

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

  async findAll(query: BaseQP) {
    const options = {
    }
    if (query.limit) options['take'] = query.limit
    if (query.limit&& query.offset) options['skip'] = query.offset
    if (query.search) {
      options['where'] = {}
      options['where']['name'] = Like(`${query.search}%`)
    }

    return await this.artistRepository.find({
      ...options,
      order: {
        main_group:  {
          name: "asc"
        },
        birthday: "asc"
      }
    });
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
