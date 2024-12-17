import 'reflect-metadata';
import { Container, decorate, injectable } from 'inversify';
import { BookService } from "../books/services/mongo.book.service"
import { AbstractBookService } from '../books/services/abstract.book.service';

const iocContainer = new  Container();
export default iocContainer;
