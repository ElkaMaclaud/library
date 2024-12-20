import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create.book.dto';
import { Book } from './book.model';

@Controller('book')
export class BookController {
    constructor(private readonly bookservice: BookService) { }

    @Get('/')
        async getBooks(): Promise<Array<Book>> {
            return await this.bookservice.getBooks();
    };

    @Get(':id')
    async getBook(@Param("id") id: string): Promise<Book> {
        const book = await this.bookservice.getBook(id);
        return book
    };

    @Post('/create')
    async createBooks(@Body() dto: CreateBookDto): Promise<Book> {
        return await this.bookservice.createBook(dto);
    };

    @Put(':id')
    async updateBook(@Param("id") id: string, @Body() dto: CreateBookDto): Promise<Book> {
        return await this.bookservice.updateBook(id, dto);   
    };

    @Delete(':id')
    async deleteBook(@Param("id") id: string): Promise<Book> {       
       return await this.bookservice.deleteBook(id);
    };
}
