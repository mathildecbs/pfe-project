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
      comment: false
    }
    if(createPostDto.parent) {
      post.parent = await this.findOne(createPostDto.parent)
      post['comment'] = true
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

    return this.utilsService.sort_posts(tree)
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

    const tree2 = await this.postTreeRepository.findDescendantsTree(tree, {depth:2, relations: ['user', 'reposts', 'likes', 'tags']})
    tree2['nb_comments'] = tree2.children.length
    tree2.children.forEach((com)=> {
      com['nb_comments'] = com.children
      com = this.utilsService.format_post(com)
    })
    tree2.children = this.utilsService.sort_posts(tree2.children)
    tree2.likes = this.utilsService.user_to_username(tree2.likes)
    tree2.reposts = this.utilsService.user_to_username(tree2.reposts)

    return this.utilsService.format_post(tree2)

  }

  async findByUser(username: string) {
    const user = await this.userService.findOne(username)
    delete user['feed']
    const posts = await this.postTreeRepository.find({
      where : {
        comment: false,
        user: {
          username : username
        }
      },
      relations: {
        likes:true,
        reposts:true,
        user: true,
        tags: true,
      },
      order: {
        create_date: 'desc'
      }
    })

    for (let post of posts) {
      post = this.utilsService.format_post(post)
      post['nb_comments'] = await this.get_nb_comments(post)
    }

    return posts
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

  async like(username:string, post_id:string) {
    const post = await this.findOne(post_id)
    const user = await this.userService.findOne(username)

    post.likes.push(user)

    const res = await this.postTreeRepository.save(post)

    if(!res) {
      throw new HttpException(`Failed to like post ${post_id}`, HttpStatus.BAD_REQUEST);
    }

    return await this.findOne(post_id)
  }
  async unlike(username:string, post_id:string) {
    const post = await this.findOne(post_id)
    const user = await this.userService.findOne(username)

    post.likes.forEach( (item, index) => {
      if(item.id === user.id) post.likes.splice(index,1);
    });

    const res = await this.postTreeRepository.save(post)

    if(!res) {
      throw new HttpException(`Failed to like post ${post_id}`, HttpStatus.BAD_REQUEST);
    }

    return await this.findOne(post_id)
  }

  async repost(username:string, post_id:string) {
    const post = await this.findOne(post_id)
    const user = await this.userService.findOne(username)

    post.reposts.push(user)

    const res = await this.postTreeRepository.save(post)

    if(!res) {
      throw new HttpException(`Failed to repost post ${post_id}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(post_id)
  }
  async unrepost(username:string, post_id:string) {
    const post = await this.findOne(post_id)
    const user = await this.userService.findOne(username)

    post.reposts.forEach( (item, index) => {
      if(item.id === user.id) post.reposts.splice(index,1);
    });

    const res = await this.postTreeRepository.save(post)

    if(!res) {
      throw new HttpException(`Failed to unrepost post ${post_id}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(post_id)
  }

  async following_feed(username:string) {
    const user = await this.userService.findOne(username)
    let following:Post[] = []
    for (const follow of user.following) {
      const posts = await this.findByUser(follow.username)
      following = following.concat(posts)
    }

    return this.utilsService.sort_posts(following)
  }


}
