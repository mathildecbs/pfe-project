import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Like, Repository } from 'typeorm';
import { TagQP } from './dto/query-params.dto';

@Injectable()
export class TagService {

  constructor(
    @InjectRepository(Tag)
    private tagRepository : Repository<Tag>
  ) {
  }
  async create(createTagDto: CreateTagDto) {
    const unique = await this.check_unity(createTagDto.name)

    const res = await this.tagRepository.save(createTagDto)

    if(!res) {
      throw new HttpException(`Creation failed `, HttpStatus.BAD_REQUEST);

    }

    return await this.findOne(res.name)

  }

  async findAll(query: TagQP) {
    const options = {}
    options['take'] = 5
    if (query.search) options['where'] = {}
    if (query.search) options['where']['name'] = Like(`${query.search}%`)

    return await this.tagRepository.find(options);
  }

  async findAllAndCount() {
    return await this.tagRepository.createQueryBuilder('tag')
      .loadRelationCountAndMap('tag.nb_posts', 'tag.posts', 'post')
      .getMany()

  }

  async findOne(name: string) {
    const res = await this.tagRepository.find({
      where : {name},
      relations: {
        posts: true
      }
    })

    if(res.length===0 ) {
      throw new HttpException(`tag ${name} not found`, HttpStatus.NOT_FOUND);
    }
    return res[0];
  }
  async check_unity(name: string) {
    try {
      await this.findOne(name)
    } catch (e: any) {
      return true
    }
    throw new HttpException(`${name} already exist`, HttpStatus.BAD_REQUEST)
  }

}
