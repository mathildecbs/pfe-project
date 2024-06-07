import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';

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
      delete user.maj_date
      delete user.password
      delete user.create_date

    })

    return users
  }

  create_feed(posts: Post[], reposts: Post[]):Post[] {
    let feed: Post[] = []
    const posts_without_com = posts.filter((post)=>
      !post.comment
    )
    posts = this.sort_posts(posts)
    feed = posts_without_com
    feed.concat(reposts)
    feed = this.sort_posts(feed)

    return feed
  }

  sort_posts(post:Post[]) {
    return post.sort((a, b)=> (a.create_date> b.create_date? -1: 1))
  }
}
