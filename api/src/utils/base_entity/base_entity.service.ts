import { Injectable } from '@nestjs/common';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsInt } from 'class-validator';

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

}
