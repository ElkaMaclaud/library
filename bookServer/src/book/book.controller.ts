import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create.book.dto';

@Controller('book')
export class BookController {
    constructor(private readonly bookservice: BookService) { }

    @Get('/')
        async getBooks(){
            return await this.bookservice.getBooks();
    };

    @Get(':id')
    async getBook(@Param("id") id: string) {
        const book = await this.bookservice.getBook(id);
        return book
    };

    @Post('/create')
    async createBooks(@Body() dto: CreateBookDto) {
        return await this.bookservice.createBook(dto);
    };

    @Put(':id')
    async updateBook(@Param("id") id: string, @Body() dto: CreateBookDto) {
        return await this.bookservice.updateBook(id, dto);   
    };

    @Delete(':id')
    async deleteBook(@Param("id") id: string) {       
       return await this.bookservice.deleteBook(id);
    };
}
