import 'reflect-metadata';
import { Container } from 'inversify';
import { BookRepository } from "./book/bookService"

const container = new Container();
container.bind(BookRepository).toSelf();
// container.bind(UserRepository).toSelf();

export default container;