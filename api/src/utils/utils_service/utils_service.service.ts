import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class UtilsServiceService {

  format_user(user: User) {
    delete user.password

    return user
  }

  user_to_username(users: User[]): string[] {
    const usernames: string[] = []

    users.forEach((user) => {
      usernames.push(user.username)
    })

    return usernames
  }
}
