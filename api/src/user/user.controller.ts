import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQP } from './dto/query-params.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto)
  }

  @Get()
  async findAll(@Query() query: UserQP) {
    return await this.userService.findAll(query);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return await this.userService.findOne(username);
  }

  @Patch(':username')
  async update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(username, updateUserDto);
  }

  @Patch(':username/follow/:username2')
  async follow(@Param('username') username: string, @Param('username2') username2: string) {
    return await this.userService.follow(username, username2);
  }

  @Delete(':username')
  async remove(@Param('username') username: string) {
    return await this.userService.remove(username);
  }
}
