import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQP } from './dto/query-params.dto';
import { UserGuard } from './user.guard';
import { CreateOwnedAlbumDto } from '../album/dto/create-owned-album.dto';
import { CreateOwnedInclusionDto } from '../inclusion/dto/create-owned-inclusion.dto';
import { UpdateOwnedInclusionDto } from '../inclusion/dto/update-owned-inclusion.dto';
import { UpdateOwnedAlbumDto } from '../album/dto/update-owned-album.dto';

@Controller('user')
@UseGuards(UserGuard)
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

  @Post('login')
  async connection(@Body() user: Object) {
    return await this.userService.connection(user);
  }

  @Patch(':username')
  async update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(username, updateUserDto);
  }

  @Patch(':username/follow/:username2')
  async follow(@Param('username') username: string, @Param('username2') username2: string) {
    return await this.userService.follow(username, username2);
  }
  @Patch(':username/unfollow/:username2')
  async unfollow(@Param('username') username: string, @Param('username2') username2: string) {
    return await this.userService.unfollow(username, username2);
  }

  @Delete(':username')
  async remove(@Param('username') username: string) {
    return await this.userService.remove(username);
  }

  @Get(':username/album')
  async get_all_albums(@Param('username') username: string){
    return await this.userService.get_all_albums(username)
  }


  @Post(':username/album')
  async add_album(@Param('username') username: string, @Body()body: CreateOwnedAlbumDto){
    return await this.userService.add_album(username, body)
  }

  @Get(':username/album/:albumId')
  async get_one_owned_album(@Param('username') username: string, @Param('albumId') albumId: string){
    return await this.userService.get_one_owned_album(username, albumId)
  }
  @Patch(':username/album/:albumId')
  async update_album(@Param('username') username: string, @Param('albumId') albumId: string, @Body() body: UpdateOwnedAlbumDto){
    return await this.userService.update_album(username, albumId, body)
  }
  @Delete(':username/album/:albumId')
  async delete_album(@Param('username') username: string, @Param('albumId') albumId: string,  @Body() body: UpdateOwnedAlbumDto){
    return await this.userService.delete_album(username, albumId, body)
  }
  @Get(':username/inclusion')
  async get_all_inclusions(@Param('username') username: string){
    return await this.userService.get_all_inclusions(username)
  }

  @Post(':username/inclusion')
  async add_inclusion(@Param('username') username: string, @Body()body: CreateOwnedInclusionDto){
    return await this.userService.add_inclusion(username, body)
  }
  @Patch(':username/inclusion/:id')
  async update_inclusion(@Param('username') username: string, @Param('id') id: string, @Body()body: UpdateOwnedInclusionDto){
    return await this.userService.update_inclusion(username, id,body)
  }
  @Delete(':username/inclusion/:id')
  async delete_inclusion(@Param('username') username: string, @Param('id') id: string,){
    return await this.userService.delete_inclusion(username, id)
  }

  @Get(':username/collection')
  async get_collection(@Param('username') username: string) {
    return await this.userService.get_collection(username)
  }

}
