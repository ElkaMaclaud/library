import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, UsePipes } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create.book.dto';
import { Book } from './book.model';
import { Observable } from 'rxjs';
import { ResponseInterceptor } from 'src/common/interceptors/response-interceptor';
import { ValidateCreateDate } from 'src/common/pipes/validatedataForCreatingBookClass-validate.pipe';

@Controller('book')
@UseInterceptors(ResponseInterceptor)
export class BookController {
    constructor(private readonly bookservice: BookService) { }

    @Get('/')
    async getBooks(): Promise<Array<Book>> {
        return await this.bookservice.getBooks();
    };

    @Get(':id')
    getBook(@Param("id") id: string): Observable<Book> {
        return this.bookservice.getBook(id);
        // const book = await this.bookservice.getBook(id);
        // return book
    };

    @Post('/')
    @UsePipes(ValidateCreateDate)
    async createBooks(@Body() dto: CreateBookDto): Promise<Book> {
        return await this.bookservice.createBook(dto);
    };

    @Put(':id')
    async updateBook(@Param("id") id: string, @Body() dto: CreateBookDto): Promise<Book> {
        return await this.bookservice.updateBook(id, dto);   
    };

    @Delete(':id')
    deleteBook(@Param("id") id: string): Observable<Book> {       
       return this.bookservice.deleteBook(id);
    };
}
