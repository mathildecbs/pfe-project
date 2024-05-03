import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQP } from './dto/query-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository, TreeRepository } from 'typeorm';
import { UtilsServiceService } from '../utils/utils_service/utils_service.service';
import { UserService } from '../user/user.service';
import { TagService } from '../tag/tag.service';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Post)
    private postTreeRepository: TreeRepository<Post>,
    private utilsService: UtilsServiceService,
    private userService: UserService,
    private tagService: TagService

  ) {
  }
  async create(createPostDto: CreatePostDto) {
    const user = await this.userService.findOne(createPostDto.user)
    const tags = []
    for (const tag of createPostDto.tags) {
      const tag_object = await this.tagService.findOneTag(tag)
      tags.push(tag_object)
    }
    const post = {
      ...createPostDto,
      tags,
      user,
      parent: undefined,
      children: [],
      likes: [],
      reposts: [],
    }
    if(createPostDto.parent) {
      post.parent = await this.findOne(createPostDto.parent)
    }
    const res = await this.postRepository.save(post)
    if( !res ) {
      throw new HttpException(`Creation failed `, HttpStatus.BAD_REQUEST);
    }
    const new_post = await this.findOne(res.id)
    return this.utilsService.format_post(new_post);
  }

  async findAll(query: PostQP) {
    const tree = await this.postTreeRepository.findRoots({
      relations: [
        'likes',
        'reposts',
        'user',
        'tags',
      ]
    })

    for (let post of tree) {
      post = this.utilsService.format_post(post)
      post['nb_comments'] = await this.get_nb_comments(post)
    }

    return tree
  }

  async findOne(id: string) {
    const tree = await this.postTreeRepository.findOne({
      where: {
        id
      },
      relations : {
        user:true,
        reposts:true,
        likes: true,
        tags: true,
        parent: true,
      }
    })

    if(!tree ){
      throw new HttpException(`post not found : ${tree}`, HttpStatus.NOT_FOUND);
    }

    const children = await this.postTreeRepository.findDescendants(tree, {depth:1, relations : ['user', 'reposts', 'likes']})
    for (let child of children) {
      child = this.utilsService.format_post(child)
      child['nb_comments'] = await this.get_nb_comments(child)
    }
    tree['nb_comments'] = await this.get_nb_comments(tree)
    tree['children'] = children

    return this.utilsService.format_post(tree)

  }

  async remove(id: string) {
    const post = await this.findOne(id)
    try {
      const res = await this.postTreeRepository.delete(id)

      return true
    }
     catch (e: any) {
       throw new HttpException(`Fail on delete post ${id} : ${e}`, HttpStatus.BAD_REQUEST)

     }

  }

  async get_nb_comments(post:Post){
    return await this.postTreeRepository.countDescendants(post)

  }
}
