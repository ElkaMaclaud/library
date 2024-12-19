import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create.book.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.model';

@Injectable()
export class BookService {
    constructor(@InjectModel('Book') private book: Model<Book>) {}

    async getBooks() {
        return await this.book.find().select("-__v");
    };
    
    async getBook(id: string) {
        const book = await this.book.findById(id);
        return book
    };
     

    async createBook(dto: CreateBookDto) {
        const newBook = await this.book.create(dto)
        return newBook.save();
    };
 
    async updateBook(id: string, dto: CreateBookDto) {
        return await this.book.findByIdAndUpdate(id, dto);
    };

    async deleteBook(id: string) {
        return await this.book.findByIdAndDelete(id);
    };
}
