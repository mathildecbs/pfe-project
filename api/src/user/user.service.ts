import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, MoreThanOrEqual, Repository } from 'typeorm';
import { UtilsServiceService } from '../utils/utils_service/utils_service.service';
import { UserQP } from './dto/query-params.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateOwnedAlbumDto } from '../album/dto/create-owned-album.dto';
import { OwnedAlbum } from '../album/entities/owned-album.entity';
import { OwnedInclusion } from '../inclusion/entities/owned-inclusion.entity';
import { AlbumService } from '../album/album.service';
import { InclusionService } from '../inclusion/inclusion.service';
import { CreateOwnedInclusionDto } from '../inclusion/dto/create-owned-inclusion.dto';
import { UpdateOwnedInclusionDto } from '../inclusion/dto/update-owned-inclusion.dto';
import { UpdateOwnedAlbumDto } from '../album/dto/update-owned-album.dto';
import { Repost } from "../post/entities/repost.entity";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private utilsService: UtilsServiceService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(OwnedAlbum)
    private albumRepository: Repository<OwnedAlbum>,
    @InjectRepository(OwnedInclusion)
    private inclusionRepository: Repository<OwnedInclusion>,
    private albumService: AlbumService,
    private inclusionService: InclusionService,
    @InjectRepository(Repost)
    private repostRepository: Repository<Repost>
  
  ) {
  }
  async create(createUserDto: CreateUserDto) {
    //check if username is unique
    const unique = await this.check_unity(createUserDto.username);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const new_user = await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
      isAdmin: false
    })

    if (!new_user ){
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    }

    const connection_user = {
      username: createUserDto.username,
      password: createUserDto.password
    }

    const connected_user = await this.connection(connection_user);

    return (await this.findOne(new_user.username),connected_user );
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
      following: [],
      reposts: this.utilsService.transform_reposts_post(res.reposts),
    }

    for(const post of user.posts) {
      post.user = this.utilsService.format_user_simplify(post.user)
    }
    user.followers = this.utilsService.user_to_username(res.followers)
    user.following = this.utilsService.user_to_username(res.following)
    return this.utilsService.format_user(user);
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(username)

    if(updateUserDto.username) {
      const unique = await this.check_unity(updateUserDto.username)
    }

    const new_user = {
      ...user,
      ...updateUserDto
      }
      
      const updateResult = await this.usersRepository.update(user.id, {
        ...updateUserDto,
        isAdmin: user.isAdmin
    })

    if (!updateResult ){
      throw new HttpException('User update failed', HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(new_user.username);
  }

  async update_admin(username: string) {
    const user = await this.findOne(username)

    //if(updateUserDto.username) {
    //  const unique = await this.check_unity(updateUserDto.username)
    //}

    //const new_user = {
    //  ...user,
    //  ...updateUserDto,
    //}
    const updateResult = await this.usersRepository.update(user.id, {
      isAdmin: !user.isAdmin
    })


    if (!updateResult ){
      throw new HttpException('User update failed', HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(user.username);
  }

  async remove(username: string) {
    const user = await this.findOne(username)

    user.following = []
    user.followers = []
    user.likes= []

    const collection = await this.get_collection(username)
    for (const album of collection.albums) {
      await this.albumRepository.delete(album.id)
    }

    for (const inclusion of collection.inclusions) {
      await this.inclusionRepository.delete(inclusion.id)
    }

    const reposts = await this.repostRepository.find({
      where: {user: {id:user.id}}
    })

    for(const repost of reposts) {
      await this.repostRepository.delete(repost.id)
    }

    await this.usersRepository.save(user)
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

    const payload = { username: user.username, sub: user.id, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '12h',
    });

    const connected_user = await this.findOne(user.username);

    return { user: connected_user, access_token: token };
  }

  async add_album(username: string, body: CreateOwnedAlbumDto) {
    const new_owned_album = {
      ...body,
      album: null,
      user: null
    }
    new_owned_album.user = await this.findOne(username)
    new_owned_album.album = await this.albumService.findOne(body.album)

    if(new_owned_album.version && !new_owned_album.album.versions.includes(new_owned_album.version)) {
      throw new HttpException(`version ${body.version} not in album versions ${new_owned_album.album.versions}`, HttpStatus.BAD_REQUEST)
    }
    if(new_owned_album.quantity<0) {
      throw new HttpException(`quantity has to be greater than 0 `, HttpStatus.BAD_REQUEST)
    }

    const res = await this.albumRepository.save(new_owned_album)
    if( !res ) {
      throw new HttpException(`Creation failed `, HttpStatus.BAD_REQUEST);
    }

    return this.get_one_owned_album(username, body.album);
  }

  async add_inclusion(username: string, body: CreateOwnedInclusionDto) {
    const new_owned_inclusion = {
      ...body,
      inclusion: null,
      user: null
    }
    new_owned_inclusion.user = await this.findOne(username)
    new_owned_inclusion.inclusion = await this.inclusionService.findOne(body.inclusion)


    if(new_owned_inclusion.quantity<=0) {
      throw new HttpException(`quantity has to be greater than 0 `, HttpStatus.BAD_REQUEST)
    }

    try {
      await this.get_one_owned_album(username, new_owned_inclusion.inclusion.album.id)

    } catch (e) {
      await this.add_album(username, {quantity:0, album: new_owned_inclusion.inclusion.album.id})
    }

    const res = await this.inclusionRepository.save(new_owned_inclusion)
    if( !res ) {
      throw new HttpException(`Creation failed `, HttpStatus.BAD_REQUEST);
    }

    return this.get_collection(username);
  }

  async get_collection(username:string){
    const user = await this.findOne(username)

    const albums  = await this.albumRepository.find({
      where:{user: {id: user.id}},
      relations: {
        album: true
      }
    })

    const inclusions = await this.inclusionRepository.find({
      where:{user: {id: user.id}},
      relations: {
        inclusion: true
      }
    })

    return {albums, inclusions}
  }

  async get_one_owned_album(username: string, albumId: string) {
    const user = await this.findOne(username)
    const album = await this.albumService.findOne(albumId)

    const owned = await this.albumRepository.find({
      where: {
        user: {
          id: user.id
        },
        album: {
          id: albumId
        }
      }
    })

    if(owned.length===0){
      throw new HttpException(`album ${albumId} owned by ${username}`, HttpStatus.NOT_FOUND);
    }

    const inclusions = await this.inclusionRepository.find({
      where: {
        user : {
          id: user.id
        },
        inclusion: {
          album : {
            id: albumId
          }
        }
      }
    })

    return {owned, inclusions}
  }

  async get_all_albums(username: string) {
    const user = await this.findOne(username)

    return await this.albumRepository.find({where: {user: {id: user.id}}, order: {
      album : {
        release_date: "ASC"
      }
    }})

  }

  async update_album(username: string, album_id: string, body: UpdateOwnedAlbumDto) {
    const user = await this.findOne(username)
    const album = await this.albumRepository.findOne({
      where: {
        album : {
          id: album_id
        },
        version: body.version
      }
    })
    album.quantity+= body.quantity

    if(album.quantity<=0) {
      throw new HttpException(`quantity has to be greater than 0 `, HttpStatus.BAD_REQUEST)
    }

    const res = await this.albumRepository.save(album)
    if( !res ) {
      throw new HttpException(`Update failed `, HttpStatus.BAD_REQUEST);
    }

    return this.get_one_owned_album(username, album_id);

  }

  async delete_album(username: string, album_id: string, body: UpdateOwnedAlbumDto) {

    const albums = await this.get_one_owned_album(username, album_id)

    if( albums.inclusions.length===0 || albums.owned.length>1) {
      const album = albums.owned.find((album_owned)=> album_owned.version===body.version)
      const res = await this.albumRepository.delete(album.id)
      if( !res ) {
        throw new HttpException(`Delete failed `, HttpStatus.BAD_REQUEST);
      }

      return true;
    } else {
      const album = albums.owned.find((album_owned)=> album_owned.version===body.version)
      album.quantity=0
      album.version=null
      const res = await this.albumRepository.save(album)
      if( !res ) {
        throw new HttpException(`Delete failed `, HttpStatus.BAD_REQUEST);
      }

      return true;
    }

  }

  async get_all_inclusions(username: string) {
    const user = await this.findOne(username)

    return await this.inclusionRepository.find({where: {user: {id: user.id}}, order: {
        inclusion : {
          name: "ASC"
        }
      }})
  }

  async update_inclusion(username: string, inclusion_id: string ,body: UpdateOwnedInclusionDto)  {
    const user = await this.findOne(username)
    const inclusion = await this.inclusionRepository.findOne({
      where: {
        inclusion : {
          id: inclusion_id
        }
      }
    })
    inclusion.quantity+= body.quantity

    if(inclusion.quantity<=0) {
      throw new HttpException(`quantity has to be greater than 0 `, HttpStatus.BAD_REQUEST)
    }

    const res = await this.inclusionRepository.save(inclusion)
    if( !res ) {
      throw new HttpException(`Update failed `, HttpStatus.BAD_REQUEST);
    }

    return this.get_collection(username);
  }

  async delete_inclusion(username: string, inclusion_id: string){
    const inclusion = await this.inclusionRepository.findOne({
      where: {
        inclusion : {
          id: inclusion_id
        }
      }
    })


    const res = await this.inclusionRepository.delete(inclusion.id)
    if( !res ) {
      throw new HttpException(`Delete failed `, HttpStatus.BAD_REQUEST);
    }
    const album = await this.get_one_owned_album(username, inclusion.inclusion.album.id)

    if(album.owned.length===1 && album.owned[0].quantity===0) {
      const del = await this.delete_album(username, album.owned[0].album.id, { quantity: 0, version: null });
    }

    return true;
  }

  async is_user_admin(username: string) {
    const user = await this.findOne(username);
    return (user.isAdmin);
  }
}
