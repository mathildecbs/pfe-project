import { OwnedAlbum } from "./ownedAlbumType";
import { OwnedInclusion } from "./ownedInclusionType";

export interface User {
  id: number;
  create_date: string;
  maj_date: string;
  username: string;
  name: string;
  description: string;
  following: User[];
  followers: User[];
  // albums: OwnedAlbum[];
  // inclusions: OwnedInclusion[];
}
