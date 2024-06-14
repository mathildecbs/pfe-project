import { Post } from "./PostType";

export interface Tag {
  id: string;
  create_date: string;
  maj_date: string;
  name: string;
  posts: Post[];
}
