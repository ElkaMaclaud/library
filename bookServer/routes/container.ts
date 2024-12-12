import 'reflect-metadata';
import { Container, decorate, injectable } from 'inversify';
import { BookService } from "./book/books.service"

const container = new Container();
container.bind(BookService).toSelf();
// container.bind(UserRepository).toSelf();
decorate(injectable(), BookService)
container.bind< >("BOOKS_SERVICE").to(BookService).inSingletonScope()

export default container;