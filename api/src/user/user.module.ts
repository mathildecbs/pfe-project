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
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OwnedAlbum, OwnedInclusion]), AlbumModule, InclusionModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '12h' },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UtilsServiceService],
  exports: [UserService]
})
export class UserModule {}
