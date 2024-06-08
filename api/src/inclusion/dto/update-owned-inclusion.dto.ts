import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateOwnedInclusionDto {
  @IsInt()
  quantity: number

}
