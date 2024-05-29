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

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
