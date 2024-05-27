import { PartialType } from '@nestjs/mapped-types';
import { CreateInclusionDto } from './create-inclusion.dto';

export class UpdateInclusionDto extends PartialType(CreateInclusionDto) {}
