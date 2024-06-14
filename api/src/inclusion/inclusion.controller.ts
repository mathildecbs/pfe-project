import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InclusionService } from './inclusion.service';
import { CreateInclusionDto } from './dto/create-inclusion.dto';
import { UpdateInclusionDto } from './dto/update-inclusion.dto';
import { BaseQP } from '../utils/base_entity/base_entity.service';
import { IsRouteAdmin } from 'src/decorator/admin.decorator';

@Controller('inclusion')
export class InclusionController {
  constructor(private readonly inclusionService: InclusionService) {}

  @Post()
  @IsRouteAdmin()
  async create(@Body() createInclusionDto: CreateInclusionDto) {
    return await this.inclusionService.create(createInclusionDto);
  }

  @Get()
  async findAll(@Query() query: BaseQP) {
    return await this.inclusionService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.inclusionService.findOne(id);
  }

  @Patch(':id')
  @IsRouteAdmin()
  async update(@Param('id') id: string, @Body() updateInclusionDto: UpdateInclusionDto) {
    return await this.inclusionService.update(id, updateInclusionDto);
  }

  @Delete(':id')
  @IsRouteAdmin()
  async remove(@Param('id') id: string) {
    return await this.inclusionService.remove(id);
  }
}
