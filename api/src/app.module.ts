import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from "@nestjs/config";
import { UserModule } from './user/user.module';
import { BaseEntityService } from './utils/base_entity/base_entity.service';
import * as process from "node:process";
import { User } from './user/entities/user.entity';
import { UtilsServiceService } from './utils/utils_service/utils_service.service';
import { ArtistModule } from './artist/artist.module';
import { GroupModule } from './group/group.module';
import { Artist } from './artist/entities/artist.entity';
import { Group } from './group/entities/group.entity';
import { AlbumModule } from './album/album.module';
import { InclusionModule } from './inclusion/inclusion.module';
import { Album } from './album/entities/album.entity';
import { Inclusion } from './inclusion/entities/inclusion.entity';
import { OwnedAlbum } from './album/entities/owned-album.entity';
import { OwnedInclusion } from './inclusion/entities/owned-inclusion.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'pfe_db',
      entities: [
        User,
        Artist,
        Group,
        Album,
        OwnedAlbum,
        Inclusion,
        OwnedInclusion
      ],
      synchronize: true,
    }),
    UserModule,
    ArtistModule,
    GroupModule,
    AlbumModule,
    InclusionModule,
  ],
  controllers: [
    AppController
  ],
  providers: [AppService, BaseEntityService, UtilsServiceService],
})
export class AppModule {}
