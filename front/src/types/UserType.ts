import { OwnedAlbum } from "./OwnedAlbumType";
import { OwnedInclusion } from "./OwnedInclusionType";
import { Post } from "./PostType";

export interface User {
  id: number;
  create_date: string;
  maj_date: string;
  username: string;
  name: string;
  description: string;
  following: User[];
  followers: User[];
  feed: Post[];
  likes: Post[];
  albums: OwnedAlbum[];
  inclusions: OwnedInclusion[];
  posts: Post[];
  reposts: Post[];
  isAdmin: boolean;
  image: string;
}
