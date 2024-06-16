import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Like, Repository, TreeRepository } from 'typeorm';
import { BaseQP } from '../utils/base_entity/base_entity.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Group)
    private groupTreeRepository: TreeRepository<Group>
  ) {
  }
  async create(createGroupDto: CreateGroupDto) {
    const group = {
      ...createGroupDto,
      parent: null,
      albums: [],
      members: [],
      children: []
    }

    if (createGroupDto.parent) {
      group.parent = (await this.findOne(createGroupDto.parent)).id
    }

    const new_group = await this.groupTreeRepository.save(group)

    return await this.findOne(new_group.id);
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

    return await this.groupTreeRepository.find({
      ...options,
      order: {
        name: "asc"
      }
    });
  }

  async findOne(id: string) {
    const tree = await this.groupTreeRepository.findOne({
      where: {
        id
      },
      relations: {
        parent: true,
        albums: true,
        members: true
      }
    })
    if(!tree ){
      throw new HttpException(`group not found : ${tree}`, HttpStatus.NOT_FOUND);
    }
    return tree;
  }

  async update(id: string, updateDto: UpdateGroupDto) {
    const group = await this.findOne(id)

    if(updateDto.image) group.image = updateDto.image

    const res = await this.groupRepository.save(group)
    if( !res ) {
      throw new HttpException(`Update failed for group ${id}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(res.id);
  }

  async remove(id: string) {
    const group = await this.findOne(id)
    try {
      const res = await this.groupTreeRepository.delete(group.id)
      return true;
    } catch (e: any) {
      throw new HttpException(`Fail on delete group ${id} : ${e}`, HttpStatus.BAD_REQUEST)

    }
  }
}
