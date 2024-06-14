import { Post } from "./PostType";
import { Tag } from "./TagType";
import { TrendingPost } from "./TrendingPostType";

export interface Trending {
  posts: TrendingPost[],
  tags: Tag[]
}
