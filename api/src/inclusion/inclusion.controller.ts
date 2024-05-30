import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InclusionService } from './inclusion.service';
import { CreateInclusionDto } from './dto/create-inclusion.dto';
import { UpdateInclusionDto } from './dto/update-inclusion.dto';

@Controller('inclusion')
export class InclusionController {
  constructor(private readonly inclusionService: InclusionService) {}

  @Post()
  async create(@Body() createInclusionDto: CreateInclusionDto) {
    return await this.inclusionService.create(createInclusionDto);
  }

  @Get()
  async findAll() {
    return await this.inclusionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.inclusionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInclusionDto: UpdateInclusionDto) {
    return this.inclusionService.update(+id, updateInclusionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.inclusionService.remove(id);
  }
}
