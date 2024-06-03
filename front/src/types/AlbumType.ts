import { Artist } from "./ArtistType";
import { Group } from "./GroupType";

export interface Album {
  id: number;
  create_date: string;
  maj_date: string;
  name: string;
  release_date: string;
  solo: boolean;
  artist: Artist;
  group: Group;
  version: string;
  image: string;
}
