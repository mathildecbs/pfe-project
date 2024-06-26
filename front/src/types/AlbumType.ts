import { Artist } from "./ArtistType";
import { Group } from "./GroupType";
import { Inclusion } from "./InclusionType";

export interface Album {
  id: string;
  create_date: string;
  maj_date: string;
  name: string;
  release_date: string;
  solo: boolean;
  artist: Artist;
  group: Group;
  versions: string[];
  image: string;
  inclusions: Inclusion[];
}
