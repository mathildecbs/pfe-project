import { Tag } from "./tagType";
import { User } from "./userType";

export interface Post {
  id: number;
  create_date: string;
  maj_date: string;
  user: User;
  likes: User[];
  repost: User[];
  image: string;
  parent: Post;
  comments: Post[];
  nb_comment: number;
  tags: Tag[];
  content: string;
}
