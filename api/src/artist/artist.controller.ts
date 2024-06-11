import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { BaseQP } from '../utils/base_entity/base_entity.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistService.create(createArtistDto);
  }

  @Get()
  async findAll(@Query() query: BaseQP) {
    return await this.artistService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.artistService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.artistService.remove(id);
  }
}
