import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {  Like, MoreThanOrEqual, Repository } from 'typeorm';
import { UtilsServiceService } from '../utils/utils_service/utils_service.service';
import { UserQP } from './dto/query-params.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private utilsService: UtilsServiceService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService

  ) {
  }
  async create(createUserDto: CreateUserDto) {
    //check if username is unique
    const unique = await this.check_unity(createUserDto.username);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const new_user = await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword
    })

    if (!new_user ){
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(new_user.username);
  }

  async findAll(query: UserQP) {
    const options = {
    }
    if (query.create_date || query.search) options['where'] = {}
    if (query.create_date) options['where']['create_date'] = MoreThanOrEqual(query.create_date)
    if (query.limit) options['take'] = query.limit
    if (query.limit&& query.offset) options['skip'] = query.offset
    if (query.search) options['where']['username'] = Like(`${query.search}%`)

    const users = await this.usersRepository.find({
   ...options
    })

    //remove privates values
    users.forEach((user)=> {
      user = this.utilsService.format_user(user)
    })
    return users;
  }

  async findOne(username: string) {

    const res = (await this.usersRepository.find(
      {
        where : {username},
        relations: {
          following: true,
          followers: true,
          posts: true,
          reposts: true
        }
    }))[0]

    if (!res) {
      throw new HttpException(`User not found for username : ${username}`, HttpStatus.NOT_FOUND);
    }
    const user = {
      ...res,
      followers: [],
      following: []
    }
    user.followers = this.utilsService.user_to_username(res.followers)
    user.following = this.utilsService.user_to_username(res.following)
    user['feed'] = this.utilsService.create_feed(res.posts, res.reposts)

    return this.utilsService.format_user(user);
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(username)

    if( updateUserDto.username) {
      const unique = await this.check_unity(updateUserDto.username)
    }

    const new_user = {
      ...user,
      ...updateUserDto
    }
    const updateResult = await this.usersRepository.update(user.id, {
      ...updateUserDto
    })


    if (!updateResult ){
      throw new HttpException('User update failed', HttpStatus.BAD_REQUEST);
    }
    return this.findOne(new_user.username);
  }

  async remove(username: string) {
    const user = await this.findOne(username)
    try {
      const res = await this.usersRepository.delete(user.id)
      return true;
    }
    catch (e: any) {
      throw new HttpException(`Fail on delete user ${username} : ${e}`, HttpStatus.BAD_REQUEST)

    }

  }

  async follow(follower: string, following: string) {
    const user_follower = await this.findOne(follower)
    const user_following = await this.findOne(following)

    const following_list = user_follower.following
    following_list.push(user_following)

    const res = await this.usersRepository.save({...user_follower, following: following_list})

    if (!res ){
      throw new HttpException(`Failed to follow user ${following}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(follower)
  }
  async unfollow(follower: string, following: string) {
    const user_follower = await this.findOne(follower)
    const user_following = await this.findOne(following)

    user_follower.following.forEach( (item, index) => {
      if(item.id === user_following.id) user_follower.following.splice(index,1);
    });

    const res = await this.usersRepository.save(user_follower)

    if (!res ){
      throw new HttpException(`Failed to follow user ${following}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(follower)
  }



  async check_unity(username: string) {
    try {
      await this.findOne(username)
    } catch (e: any) {
      return true
    }
    throw new HttpException(`username ${username} already taken`, HttpStatus.BAD_REQUEST)
  }

  async connection(response: Object) {

    const username = response['username']
    const password = response['password']

    const user = (await this.usersRepository.find({
        select: {
          id: true,
          username: true,
          password: true
      },
        where : {username: username}
    }))[0]


    if (!user) {
      throw new HttpException(`authentication failed`, HttpStatus.BAD_REQUEST)
    }

    const password_match = await bcrypt.compare(password, user.password);

    if (!password_match) {
      throw new HttpException(`authentication failed`, HttpStatus.BAD_REQUEST)
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '12h',
    });

    return { access_token: token };
  }
}
