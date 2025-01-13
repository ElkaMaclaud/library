import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './config/mongo.config';
import { AuthModule } from './auth/auth.module';
import { BookCommentModule } from './book-comment/book-comment.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return await getMongoConfig(configService);
          },
        }),
    BookModule,
    AuthModule,
    BookCommentModule,
    CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
