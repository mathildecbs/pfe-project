import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UtilsServiceService } from '../utils/utils_service/utils_service.service';
import { OwnedAlbum } from '../album/entities/owned-album.entity';
import { OwnedInclusion } from '../inclusion/entities/owned-inclusion.entity';
import { AlbumModule } from '../album/album.module';
import { InclusionModule } from '../inclusion/inclusion.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, OwnedAlbum, OwnedInclusion]), AlbumModule, InclusionModule],
  controllers: [UserController],
  providers: [UserService, UtilsServiceService],
  exports: [UserService]
})
export class UserModule {}
