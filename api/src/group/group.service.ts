import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository, TreeRepository } from 'typeorm';

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

  async findAll() {
    return await this.groupTreeRepository.find();
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

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
