import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), GroupModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService]
})
export class ArtistModule {}
