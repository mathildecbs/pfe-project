import { Album } from "./AlbumType";

export interface OwnedAlbum {
  id: string;
  create_date: string;
  maj_date: string;
  album: Album;
  quantity: number;
  version: string;
}
