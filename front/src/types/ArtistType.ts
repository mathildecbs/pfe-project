import { Album } from "./AlbumType";
import { Group } from "./GroupType";
import { Inclusion } from "./InclusionType";

export interface Artist {
  id: string;
  create_date: string;
  maj_date: string;
  name: string;
  birthday: string;
  image: string;
  albums: Album[];
  inclusions: Inclusion[];
  main_group: Group;
  groups: Group[];
}
