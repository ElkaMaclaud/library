import fs from "fs"
// import fileMiddleware from "../../middlewares/file"
import dotenv from "dotenv"
import { Response } from 'express';
import http from 'http';
import { Book } from "../models/book.model"
import { CreateBookDto } from "../../domain/dto/create-book.dto";
import { BookInterface } from "../../domain/book.interface";
import { injectable } from "inversify";
import { AbstractBookService } from "./abstract.book.service";


dotenv.config()

@injectable()
export class InMemoryService extends AbstractBookService {
    constructor() { //private book: typeof Book
        super()
        //this.book 
    }

    async getBooks(): Promise<BookInterface[]> {
        const books = await Book.find().select("-__v")
        return books
    }

    async getBook(id: string):  Promise<BookInterface | void> {
        const book = await Book.findById(id).select("-__v")
        return book
    };

    async createBook(book: CreateBookDto): Promise<BookInterface> {
        const newBook = new Book(book)
        const newBookCreate = await newBook.save()
        const response = newBookCreate.toObject();
        if ('__v' in response) {
            delete response.__v;
        }
        return response
    }

    async updateBook(id: string, book: CreateBookDto): Promise<BookInterface> { return };
    
    async deleteBook(id: string): Promise<void> {};
    
    async downloadBook(id: string, res: Response): Promise<void> {};
}