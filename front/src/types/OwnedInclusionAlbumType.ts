import { OwnedAlbum } from "./OwnedAlbumType";
import { OwnedInclusion } from "./OwnedInclusionType";

export interface OwnedInclusionAlbum {
  inclusions: OwnedInclusion[];
  owned: OwnedAlbum[];
}
