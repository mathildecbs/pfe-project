import { Injectable } from '@nestjs/common';
import { CreateInclusionDto } from './dto/create-inclusion.dto';
import { UpdateInclusionDto } from './dto/update-inclusion.dto';

@Injectable()
export class InclusionService {
  create(createInclusionDto: CreateInclusionDto) {
    return 'This action adds a new inclusion';
  }

  findAll() {
    return `This action returns all inclusion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inclusion`;
  }

  update(id: number, updateInclusionDto: UpdateInclusionDto) {
    return `This action updates a #${id} inclusion`;
  }

  remove(id: number) {
    return `This action removes a #${id} inclusion`;
  }
}
