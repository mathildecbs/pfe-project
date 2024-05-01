import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
}
