import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from "@nestjs/axios"
import { CreateBookDto } from './dto/create.book.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.model';
import { catchError, EMPTY, firstValueFrom, forkJoin, map, Observable, of, retry } from 'rxjs';

@Injectable()
export class BookService {
    constructor(
        @InjectModel('Book') private book: Model<Book>,
        private httpService: HttpService
    ) { }

    async getBooks() {
        return await this.book.find().select("-__v");
    };

    getBook(id: string): Observable<Book> {
        const book$ = this.book.findById(id).select("-__v").exec();

        const counterIncrement$ = this.httpService.post(`http://${process.env.HOST}:3001/counter/${id}/incr`).pipe(
            retry(2),
            map((res) => res.data),
            catchError((err) => {
                console.log(err);
                return of(null);
            })
        );

        const counterGet$ = this.httpService.get(`http://${process.env.HOST}:3001/counter/${id}`).pipe(
            map((res) => res.data),
            catchError((err) => {
                console.error("Ошибка при получении данных счетчика:", err);
                throw new InternalServerErrorException("Ошибка при получении данных счетчика");
            })
        );

        return forkJoin([book$, counterIncrement$, counterGet$]).pipe(
            map(([book, _, finalData]) => {
                if (!book) {
                    throw new InternalServerErrorException("Книга не найдена");
                }
                return { ...book.toObject(), ...finalData };
            }),
            catchError((error) => {
                console.error('Error fetching book:', error);
                throw error;
            })
        );
    }

    // async getBook(id: string): Observable<Book> {
    //     const book = await this.book.findById(id).select("-__v");
    //     const counter$ = this.httpService.post(`http://${process.env.HOST}:3001/counter/${id}/incr`).pipe(
    //         retry(2),
    //         map((res) => res.data),
    //         catchError((err) => {
    //             console.log(err)

    //             return EMPTY
    //         })
    //     );
    //     let finalData: any;

    //     await new Promise((resolve, reject) => {
    //         this.httpService.get(`http://${process.env.HOST}:3001/counter/${id}`).pipe(
    //             map((res) => res.data), 
    //             catchError((err) => {
    //                 console.error("Ошибка при получении данных счетчика:", err);
    //                 reject(new InternalServerErrorException("Ошибка при получении данных счетчика"));
    //                 return EMPTY; 
    //             })
    //         ).subscribe({
    //             next: (data) => {
    //                 finalData = data;
    //                 resolve(data);
    //             },
    //             error: (err) => reject(err),
    //         });
    //     });

    //     return { ...book.toObject(), ...finalData };
    // }

    // async getBook(id: string): Promise<Book> {
    //     const book = await this.book.findById(id).select("-__v");

    //     try {
    //         await firstValueFrom(this.httpService.post(`http://${process.env.HOST}:3001/counter/${id}/incr`));
    //         const response = await firstValueFrom(this.httpService.get(`http://${process.env.HOST}:3001/counter/${id}`));
    //         const finalData = response.data;

    //         return { ...book.toObject(), ...finalData };
    //     } catch (error) {
    //         console.error("Ошибка при обращении к микросервису:", error);
    //         // throw new InternalServerErrorException("Ошибка при получении книги");
    //         return book
    //     }
    // }

    async createBook(dto: CreateBookDto) {
        const newBook = await this.book.create(dto)
        return newBook.save();
    };

    async updateBook(id: string, dto: CreateBookDto) {
        return await this.book.findByIdAndUpdate(id, dto);
    };

    deleteBook(id: string): Observable<Book> {
        const book$ = this.book.findByIdAndDelete(id);
        const deleted$ = this.httpService.delete(`http://${process.env.HOST}:3001/counter/${id}/`).pipe(
            retry(2),
            map((res) => res.data),
            catchError((err) => {
                console.log(err)
                return EMPTY
            })
        )
        return forkJoin([book$, deleted$]).pipe(
            map(([book, deleted]) => {
                if (!book) {
                    throw new InternalServerErrorException("Книга не найдена");
                }
                return { ...book.toObject() };
            }),
            catchError((error) => {
                console.error('Error fetching book:', error);
                throw error;
            })
        );
    };
    // async deleteBook(id: string) {
    //     const book = await this.book.findByIdAndDelete(id);
    //     try {
    //         this.httpService.delete(`http://${process.env.HOST}:3001/counter/${id}/`).pipe(
    //             retry(2),
    //             map((res) => res.data),
    //             catchError((err) => {
    //                 console.log(err)

    //                 return EMPTY
    //             })
    //         ).subscribe();
    //         return book
    //     } catch (error) {
    //         console.error("Ошибка при обращении к микросервису:", error);
    //         // throw new InternalServerErrorException("Ошибка при удалении");
    //         return book
    //     }
    // };

    // async deleteBook(id: string) {
    //     const book = await this.book.findByIdAndDelete(id);
    //     try {
    //         await firstValueFrom(this.httpService.delete(`http://${process.env.HOST}:3001/counter/${id}/`));
    //         return book
    //     } catch (error) {
    //         console.error("Ошибка при обращении к микросервису:", error);
    //         // throw new InternalServerErrorException("Ошибка при удалении");
    //         return book
    //     }
    // };
}
