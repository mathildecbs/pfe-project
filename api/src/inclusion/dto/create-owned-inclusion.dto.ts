import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOwnedInclusionDto {
  @IsInt()
  quantity: number

  @IsUUID()
  @IsNotEmpty()
  inclusion: string
}
