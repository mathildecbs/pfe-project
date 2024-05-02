import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagQP } from './dto/query-params.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.create(createTagDto);
  }

  @Get()
  async findAll(@Query() query: TagQP) {
    return await this.tagService.findAll(query);
  }

  @Get(':tag')
  async findOne(@Param('tag') tag: string) {
    return await this.tagService.findOne(tag);
  }


}
