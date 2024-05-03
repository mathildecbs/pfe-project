import { Module } from '@nestjs/common';
import { InclusionService } from './inclusion.service';
import { InclusionController } from './inclusion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inclusion } from './entities/inclusion.entity';
import { OwnedInclusion } from './entities/owned-inclusion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inclusion, OwnedInclusion])],
  controllers: [InclusionController],
  providers: [InclusionService],
})
export class InclusionModule {}
