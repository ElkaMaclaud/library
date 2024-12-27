import { Controller, Get, Param } from '@nestjs/common';
import { BookCommentService } from './book-comment.service';

@Controller('book-comment')
export class BookCommentController {
    constructor(private readonly bookCommentsService: BookCommentService) {}

    @Get(":bookId")
    async findAllBookComment(@Param() bookId: string) {
        return this.bookCommentsService.findAllBookComments(bookId)
    }
}
