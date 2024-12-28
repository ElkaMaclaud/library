import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookCommentService } from '../book-comment/book-comment.service';
import { CommentsGateway } from './comments.gateway';
import { BookComment, BookCommentSchema } from '../book-comment/book-comment.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: BookComment.name, schema: BookCommentSchema }]),
    ],
    providers: [BookCommentService, CommentsGateway],
})
export class CommentsModule {}