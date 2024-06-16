import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQP } from './dto/query-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository, TreeRepository } from 'typeorm';
import { UtilsServiceService } from '../utils/utils_service/utils_service.service';
import { UserService } from '../user/user.service';
import { TagService } from '../tag/tag.service';
import { Repost } from "./entities/repost.entity";

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Post)
    private postTreeRepository: TreeRepository<Post>,
    @InjectRepository(Repost)
    private repostRepository: Repository<Repost>,
    private utilsService: UtilsServiceService,
    private userService: UserService,
    private tagService: TagService

  ) {
  }
  async create(createPostDto: CreatePostDto) {
    const user = await this.userService.findOne(createPostDto.user)
    const tags = []
    for (const tag of createPostDto.tags) {
      const tag_object = await this.tagService.findOne(tag)
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
    if(query.search) return tree.filter(p => p.content.includes(query.search))

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
      com['nb_comments'] = com.children.length
      com = this.utilsService.format_post(com)
    })
    tree2.children = this.utilsService.sort_posts(tree2.children)

    return this.utilsService.format_post(tree2)

  }

  async findByUser(username: string) {
    const user = await this.userService.findOne(username)
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

  async findByUserRepost(username: string) {
    const user = await this.userService.findOne(username)
    const posts = await this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.reposts', 'repost')
      .leftJoinAndSelect('repost.user', 'userR')
      .where('userR.id=:id', {id: user.id})
      .getMany()

    const reposts:Post[] = []
    for (let post of posts) {
      post = await this.findOne(post.id)
      post['repost_date'] = post.reposts.find(repost => repost.username===username)['repost_date']
      post['nb_comments'] = await this.get_nb_comments(post)
      reposts.push(post)
    }

    return reposts
  }

  async findByTag(tag_name: string) {
    const tag = await this.tagService.findOne(tag_name)

    const posts = await this.postRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.tags', 'tag')
        .where('tag.id=:id', {id: tag.id})
        .getMany()

    const tag_posts: Post[]= []

    for (let post of posts) {
      post = await this.findOne(post.id)
      post['nb_comments'] = await this.get_nb_comments(post)
      tag_posts.push(post)
    }


    return tag_posts

  }

  async remove(id: string) {
    const post = await this.findOne(id)
    post.tags = []
    post.reposts = []
    const reposts = await this.repostRepository.find({where: {post: {id: post.id}}})
    for(const repost of reposts) {
      await this.repostRepository.delete(repost.id)
    }
    const post_without_tag = await this.postRepository.save(post)

    try {
      const res = await this.postTreeRepository.delete(id)

      return true
    }
     catch (e: any) {
       throw new HttpException(`Fail on delete post ${id} : ${e}`, HttpStatus.BAD_REQUEST)

     }

  }

  async get_nb_comments(post:Post){
    return (await this.postTreeRepository.countDescendants(post))-1

  }

  async like(username:string, post_id:string) {
    const post = await this.findOne(post_id)
    const user = await this.userService.findOne(username)

    post.likes.push(user)
    post['reposts'] = await this.find_post_repost(post_id)
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

    post['reposts'] = await this.find_post_repost(post_id)
    const res = await this.postTreeRepository.save(post)

    if(!res) {
      throw new HttpException(`Failed to like post ${post_id}`, HttpStatus.BAD_REQUEST);
    }

    return await this.findOne(post_id)
  }

  async repost(username:string, post_id:string) {
    const post = await this.findOne(post_id)
    const user = await this.userService.findOne(username)


    const res = await this.repostRepository.save({post, user})

    if(!res) {
      throw new HttpException(`Failed to repost post ${post_id}`, HttpStatus.BAD_REQUEST);
    }
    return await this.findOne(post_id)
  }
  async unrepost(username:string, post_id:string) {
    const post = await this.findOne(post_id)
    const user = await this.userService.findOne(username)

     const repost = await this.repostRepository.find({
       where: {
         post:{
           id: post_id
         },
         user : {
           id: user.id
         }
       }
     })

    if (repost.length===0) throw new HttpException(`User ${username} didn't repost post ${post_id}`, HttpStatus.BAD_REQUEST);
    const res = await this.repostRepository.delete(repost[0].id)

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

  async create_feed(username: string){
    const posts = await this.findByUser(username)
    const reposts = await this.findByUserRepost(username)
    if (reposts.length===0)  return this.utilsService.sort_posts(posts)
    if (posts.length===0)  return reposts.sort((a,b) =>(a['repost_date']> b['repost_date']? -1:1))
    let feed =posts
    feed = feed.concat(reposts)

    return  feed.sort((a,b)=> {
      if(!a['repost_date']&&!b['repost_date']&& a.create_date>b.create_date){
        return -1
      }

      if(!a['repost_date']&&!b['repost_date']&& a.create_date<b.create_date){
        return 1
      }

      if(!a['repost_date']&&b['repost_date']&& a.create_date>b['repost_date']){
        return -1
      }

      if(!a['repost_date']&&b['repost_date']&& a.create_date<b['repost_date']){
        return 1
      }

      if(a['repost_date']&&!b['repost_date']&& b.create_date>a['repost_date']){
        return 1
      }

      if(a['repost_date']&&!b['repost_date']&& b.create_date<a['repost_date']){
        return -1
      }

      if(a['repost_date']&&b['repost_date']&& a['repost_date']>b['repost_date']){
        return -1
      }

      if(a['repost_date']&&b['repost_date']&& a['repost_date']<b['repost_date']){
        return 1
      }

      return 1
    })
  }

  async trending() {
    const trending = {
      posts : [],
      tags: []
    }
    let trending_post : {post: Post, score: number}[] = []
    const tree = await this.postTreeRepository.findRoots({
      relations: [
        'likes',
        'reposts',
        'user',
        'tags',
        'children'
      ],
      depth: 2
    })
    const now = (new Date()).getTime()
    for (let post of tree) {
      let days = Math.floor(Math.floor(Math.floor((now - post.create_date.getTime()) / 1000)/60)/60/24)
      if(days===0)  days=1
      const score = (post.likes.length*10 + post.reposts.length*200+ post.children.length*300)/days
      trending_post.push({post:this.utilsService.format_post(post), score})
    }
    trending.posts = trending_post.sort((a, b)=> (a.score> b.score? -1: 1)).slice(0,10)

    trending.tags = (await this.tagService.findAllAndCount()).sort((a, b) => (a['nb_posts']> b['nb_posts'] ? -1:1)).slice(0,10)

    return trending
  }


  async find_post_repost(post_id: string): Promise<any> {
    return await this.repostRepository.find({
      where: {
        post: {
          id: post_id
        }
      }
    })
  }



}
