import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InclusionController } from './inclusion/inclusion.controller';
import { AlbumController } from './album/album.controller';
import { ArtistController } from './artist/artist.controller';
import { GroupController } from './group/group.controller';
import { PostController } from './post/post.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [],
  controllers: [AppController, InclusionController, AlbumController, ArtistController, GroupController, PostController, UserController],
  providers: [AppService],
})
export class AppModule {}
