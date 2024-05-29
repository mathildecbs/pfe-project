import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { OwnedAlbum } from './entities/owned-album.entity';
import { GroupModule } from '../group/group.module';
import { ArtistModule } from '../artist/artist.module';

@Module({
  imports : [TypeOrmModule.forFeature([Album, OwnedAlbum]), GroupModule, ArtistModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService]
})
export class AlbumModule {}
