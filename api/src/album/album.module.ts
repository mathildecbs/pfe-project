import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { OwnedAlbum } from './entities/owned-album.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Album, OwnedAlbum])],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
