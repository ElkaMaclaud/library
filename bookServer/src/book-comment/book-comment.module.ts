import { Module } from '@nestjs/common';
import { BookCommentService } from './book-comment.service';
import { BookCommentController } from './book-comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookCommentSchema } from './book-comment.model';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'BookComment', schema: BookCommentSchema }]),
      ConfigModule,
    ],
  providers: [BookCommentService],
  controllers: [BookCommentController]
})
export class BookCommentModule {}
