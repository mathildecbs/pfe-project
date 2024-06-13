import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { Repost } from "../../post/entities/repost.entity";

@Injectable()
export class UtilsServiceService {

  format_user(user: User) {
    delete user.password

    return user
  }

  format_user_simplify(user: User) {
    delete user.description
    delete user.id
    delete user.create_date
    delete user.maj_date

    return this.format_user(user)
  }

  format_post(post: Post) {
   post.user = this.format_user_simplify(post.user)
    post.reposts = this.transform_reposts(post.reposts)
   post['nb_likes'] = post.likes.length
   post['nb_reposts'] = post.reposts.length

    if (post.likes.length!==0) {
      for (let like of post.likes) {
        like = this.format_user_simplify(like)
      }
    }

    if (post.reposts.length!==0) {
      for (let repost of post.reposts) {
        repost = this.format_user_simplify(repost)
      }
    }

    return post
  }

  user_to_username(users: User[]): User[] {

    users.forEach((user) => {
      delete user.description
      delete user.password
      delete user.create_date

    })

    return users
  }

  sort_posts(post:Post[]) {
    return post.sort((a, b)=> (a.create_date> b.create_date? -1: 1))
  }

  transform_reposts(reposts: any[]) :User[] {
    const users: User[] = []
    for (const repost of reposts) {
      repost.user['repost_date'] = repost.create_date
      users.push(repost.user)
    }

    return this.user_to_username(users)
  }

  transform_reposts_post(reposts: any[]): Post[] {
    const posts: Post[] = []
    for (const repost of reposts) {
      posts.push(repost.post)
    }
    return posts
  }
}
