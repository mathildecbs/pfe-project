import { Inclusion } from "./InclusionType";
import { User } from "./userType";

export interface OwnedInclusion {
  id: number;
  create_date: string;
  maj_date: string;
  user: User;
  inclusion: Inclusion;
  quantite: number;
}
