import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
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

  @Get('following/:username')
  async following_feed(@Param('username') username:string) {
    return await this.postService.following_feed(username)
  }

  @Patch(':id/like/:username')
  async like(@Param('id') id: string, @Param('username') username: string){
    return await this.postService.like(username, id)
  }
  @Patch(':id/repost/:username')
  async repost(@Param('id') id: string, @Param('username') username: string){
    return await this.postService.repost(username, id)
  }
  @Patch(':id/unlike/:username')
  async unlike(@Param('id') id: string, @Param('username') username: string){
    return await this.postService.unlike(username, id)
  }
  @Patch(':id/unrepost/:username')
  async unrepost(@Param('id') id: string, @Param('username') username: string){
    return await this.postService.unrepost(username, id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
