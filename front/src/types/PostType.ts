import { Tag } from "./TagType";
import { User } from "./UserType";

export interface Post {
  id: number;
  create_date: string;
  maj_date: string;
  user: User;
  likes: User[];
  reposts: User[];
  image: string;
  parent: Post;
  comments: Post[];
  nb_comment: number;
  tags: Tag[];
  content: string;
}
