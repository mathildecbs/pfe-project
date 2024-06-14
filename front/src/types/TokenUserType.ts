import { User } from "./UserType";

export interface TokenUser {
  access_token: string, 
  user: User
}
