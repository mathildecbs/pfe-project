import { Inclusion } from "./InclusionType";
import { User } from "./UserType";

export interface OwnedInclusion {
  id: string;
  create_date: string;
  maj_date: string;
  user: User;
  inclusion: Inclusion;
  quantity: number;
}
