import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { BaseQP } from '../utils/base_entity/base_entity.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.albumService.create(createAlbumDto);
  }

  @Get()
  async findAll(@Query() query: BaseQP) {
    return await this.albumService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.albumService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return await this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.albumService.remove(id);
  }
}
