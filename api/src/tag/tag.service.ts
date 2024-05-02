import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: string) {
    return `This action returns a #${id} tag`;
  }

}
