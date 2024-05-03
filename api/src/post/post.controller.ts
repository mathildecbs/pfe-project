import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQP } from './dto/query-params.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto)

  }

  @Get()
  async findAll(@Query() query: PostQP) {
    return await this.postService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
