import { Album } from "./AlbumType";
import { User } from "./UserType";

export interface OwnedAlbum {
  id: string;
  create_date: string;
  maj_date: string;
  user: User;
  album: Album;
  quantity: number;
  version: string;
}
