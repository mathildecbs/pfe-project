import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInclusionDto } from './dto/create-inclusion.dto';
import { UpdateInclusionDto } from './dto/update-inclusion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inclusion } from './entities/inclusion.entity';
import { Repository } from 'typeorm';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

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

  async findAll() {
    return await this.inclusionRepository.find();
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

  update(id: number, updateInclusionDto: UpdateInclusionDto) {
    return `This action updates a #${id} inclusion`;
  }

  remove(id: number) {
    return `This action removes a #${id} inclusion`;
  }
}
