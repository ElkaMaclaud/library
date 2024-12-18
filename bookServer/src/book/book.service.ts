import { Inject, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Book } from './book.model';
import { CreateBookDto } from './dto/create.book.dto';

@Injectable()
export class BookService {
    constructor(@Inject() private readonly book: ModelType<Book>) {}

    async getBooks() {
        return await this.book.find();
    };
    
    async getBook(id: string) {
        return await this.book.findById(id);
    };
    

    async createBook(dto: CreateBookDto) {
        // const newBook = new Book(dto)
        const newBook = await this.book.create(dto)
        return newBook.save();
    };

    async updateBook(id: string, dto: CreateBookDto) {
        return await this.book.findByIdAndUpdate(id, dto);
    };

    async deleteBook(id: string) {
        return await this.book.findByIdAndDelete();
    };
}
