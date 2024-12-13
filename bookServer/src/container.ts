import 'reflect-metadata';
import { Container, decorate, injectable } from 'inversify';
import { BookService } from "./routes/book/books.service"
import {Book} from "./routes/book/books.model"

const container = new Container();
// container.bind(BookService).toSelf();
// decorate(injectable(), Book)
// container.bind<typeof Book>('Book').toConstantValue(Book);
decorate(injectable(), BookService)
container.bind<BookService>("BOOKS_SERVICE").to(BookService).inSingletonScope()

export default container;