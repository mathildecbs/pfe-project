import { InclusionEnum } from "../enums/InclusionEnum";
import { Album } from "./AlbumType";
import { Artist } from "./ArtistType";

export interface Inclusion {
  id: string;
  create_date: string;
  maj_date: string;
  name: string;
  album: Album;
  member: Artist;
  type: InclusionEnum;
  image: string;
}
