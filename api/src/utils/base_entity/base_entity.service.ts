import { Injectable } from '@nestjs/common';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsInt, IsString } from 'class-validator';

@Injectable()
export class BaseEntityService {}

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  create_date: string;

  @UpdateDateColumn()
  maj_date: string;
}

export class BaseQP {

  @IsInt()
  limit: number

  @IsInt()
  offset: number

  @IsString()
  search: string

}

export enum IncluEnum {
  PHOTOCARD = "photocard",
  POSTER = "poster",
  POSTCARD = "postcard",
  POLAROID = "polaroid",
  STICKER = "sticker",
  BOOKMARK = "bookmark",
  MESSAGECARD = "message card",
  OTHER = "other"
}
