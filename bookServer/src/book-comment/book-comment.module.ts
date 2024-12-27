import { Module } from '@nestjs/common';
import { BookCommentService } from './book-comment.service';
import { BookCommentController } from './book-comment.controller';

@Module({
  providers: [BookCommentService],
  controllers: [BookCommentController]
})
export class BookCommentModule {}
