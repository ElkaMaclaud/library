import { injectable } from "inversify";
import { BookInterface } from "../../domain/book.interface";
import { CreateBookDto } from "../../domain/dto/create-book.dto";
import { Response } from "express";

@injectable()
export abstract class AbstractBookService {
    abstract getBooks(): Promise<BookInterface[]>;
    
    abstract getBook(id: string):  Promise<BookInterface | void>;
    
    abstract createBook(book: CreateBookDto): Promise<BookInterface>;
    
    abstract updateBook(id: string, book: CreateBookDto): Promise<BookInterface>;
    
    abstract deleteBook(id: string): Promise<void>;
    
    abstract downloadBook(id: string, res: Response): Promise<void>;
}