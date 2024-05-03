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

    return post
  }

  user_to_username(users: User[]): string[] {
    const usernames: string[] = []

    users.forEach((user) => {
      usernames.push(user.username)
    })

    return usernames
  }
}
