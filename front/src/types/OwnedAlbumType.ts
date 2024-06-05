import { Album } from "./AlbumType";
import { User } from "./UserType";

export interface OwnedAlbum {
  id: number;
  create_date: string;
  maj_date: string;
  user: User;
  album: Album;
  quantite: number;
  version: string;
}
