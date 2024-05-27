import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InclusionService } from './inclusion.service';
import { CreateInclusionDto } from './dto/create-inclusion.dto';
import { UpdateInclusionDto } from './dto/update-inclusion.dto';

@Controller('inclusion')
export class InclusionController {
  constructor(private readonly inclusionService: InclusionService) {}

  @Post()
  create(@Body() createInclusionDto: CreateInclusionDto) {
    return this.inclusionService.create(createInclusionDto);
  }

  @Get()
  findAll() {
    return this.inclusionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inclusionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInclusionDto: UpdateInclusionDto) {
    return this.inclusionService.update(+id, updateInclusionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inclusionService.remove(+id);
  }
}
