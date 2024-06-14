import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UtilsServiceService } from '../utils/utils_service/utils_service.service';
import { UserModule } from '../user/user.module';
import { TagModule } from '../tag/tag.module';
import { Repost } from "./entities/repost.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post, Repost]), UserModule, TagModule],
  controllers: [PostController],
  providers: [PostService, UtilsServiceService],
})
export class PostModule {}
