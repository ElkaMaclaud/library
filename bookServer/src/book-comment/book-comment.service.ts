import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookComment } from './book-comment.model';

@Injectable()
export class BookCommentService {
    constructor(@InjectModel("BookComment") private readonly bookCommentModel: Model<BookComment>) {}

    async findAllBookComments(bookId: string) {
        const bookID = new Types.ObjectId(bookId);
        return this.bookCommentModel.find({ "bookId": bookID }).exec();
    }

    async createComment(bookId: string, text: string): Promise<BookComment> {
        const newComment = new this.bookCommentModel({ bookId: new Types.ObjectId(bookId), comment: text });
        return newComment.save();
    }
}