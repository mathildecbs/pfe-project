import { Post } from "./PostType";
import { Tag } from "./TagType";

export interface TrendingPost {
  post: Post;
  score: number;
}
