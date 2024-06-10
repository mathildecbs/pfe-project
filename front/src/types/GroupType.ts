import { Album } from "./AlbumType";
import { Artist } from "./ArtistType";

export interface Group {
  id: number;
  create_date: string;
  maj_date: string;
  name: string;
  // image: string;
  members: Artist[];
  parent: Group;
  company: string;
  albums: Album[];
}
