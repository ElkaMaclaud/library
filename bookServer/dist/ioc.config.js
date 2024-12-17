"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_book_service_1 = require("./services/abstract.book.service");
const mongo_book_service_1 = require("./services/mongo.book.service");
const container_1 = __importDefault(require("./infostructure/container"));
// decorate(injectable(), Book)
// iocContainer.bind<typeof Book>('Book').toConstantValue(Book);
// decorate(injectable(), BookService)
// iocContainer.bind(BookService).toSelf().inSingletonScope();
// iocContainer.bind<BookService>(BOOKS_SERVICE).to(BookService).inSingletonScope()
container_1.default.bind(abstract_book_service_1.AbstractBookService).to(mongo_book_service_1.BookService).inSingletonScope();
