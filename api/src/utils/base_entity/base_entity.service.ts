import { Injectable } from '@nestjs/common';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Injectable()
export class BaseEntityService {}

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  create_date: string

  @UpdateDateColumn()
  maj_date: string
}
