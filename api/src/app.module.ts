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
        User
      ],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [
    AppController
  ],
  providers: [AppService, BaseEntityService, UtilsServiceService],
})
export class AppModule {}
