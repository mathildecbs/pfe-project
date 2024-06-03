import { Module } from '@nestjs/common';
import { InclusionService } from './inclusion.service';
import { InclusionController } from './inclusion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inclusion } from './entities/inclusion.entity';
import { OwnedInclusion } from './entities/owned-inclusion.entity';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inclusion, OwnedInclusion]), ArtistModule, AlbumModule],
  controllers: [InclusionController],
  providers: [InclusionService],
  exports: [InclusionService]
})
export class InclusionModule {}
