import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInclusionDto } from './dto/create-inclusion.dto';
import { UpdateInclusionDto } from './dto/update-inclusion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inclusion } from './entities/inclusion.entity';
import { Like, Repository } from 'typeorm';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { BaseQP } from '../utils/base_entity/base_entity.service';

@Injectable()
export class InclusionService {

  constructor(
    @InjectRepository(Inclusion)
    private inclusionRepository: Repository<Inclusion>,
    private albumService: AlbumService,
    private artistService: ArtistService
  ) {
  }
  async create(createInclusionDto: CreateInclusionDto) {
    const new_inclusion = {
      ...createInclusionDto,
      album: null,
      member: null
    }

    new_inclusion.album = await this.albumService.findOne(createInclusionDto.album)

    if(createInclusionDto.member){
      new_inclusion.member = await this.artistService.findOne(createInclusionDto.member)
    }

    const res = await this.inclusionRepository.save(new_inclusion)

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
    return await this.inclusionRepository.find( {
      ...options,
      order : {
        album : {
          group: {
            name: "asc"
          },
          artist: {
            name: "asc"
          },
          release_date:"desc"
        },
        member : {
          birthday: "asc"
        }
      }
    });
  }

  async findOne(id: string) {
    const res = await this.inclusionRepository.find({
      where: { id },
      relations: {
        member: true,
        album: true
      }
    })
    if (res.length === 0) {
      throw new HttpException(`inclusion ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return res[0];
  }

  async update(id: string, updateInclusionDto: UpdateInclusionDto) {
    const inclusion = await this.findOne(id)
    const update = {
      ...inclusion,
      ...updateInclusionDto,
      member : inclusion.member,
      album : inclusion.album,
    }

    if(updateInclusionDto.member) update.member = await this.artistService.findOne(updateInclusionDto.member)
    if(updateInclusionDto.album) update.album = await this.albumService.findOne(updateInclusionDto.album)

    const res = await this.inclusionRepository.save(update)
    if( !res ) {
      throw new HttpException(`Update failed for inclusion ${id}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(res.id);
  }

  async remove(id: string) {
    const inclusion = await this.findOne(id)
    try {
      const res = await this.inclusionRepository.delete(inclusion.id)
      return true;
    } catch (e: any) {
      throw new HttpException(`Fail on delete inclusion ${id} : ${e}`, HttpStatus.BAD_REQUEST)

    }
  }
}
