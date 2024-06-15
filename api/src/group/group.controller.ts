import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { BaseQP } from '../utils/base_entity/base_entity.service';
import { IsRouteAdmin } from 'src/decorator/admin.decorator';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @IsRouteAdmin()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupService.create(createGroupDto);
  }

  @Get()
  async findAll(@Query() query: BaseQP) {
    return await this.groupService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.groupService.findOne(id);
  }


  @Delete(':id')
  @IsRouteAdmin()
  async remove(@Param('id') id: string) {
    return await this.groupService.remove(id);
  }
}
