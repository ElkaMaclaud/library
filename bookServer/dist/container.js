"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const books_service_1 = require("./routes/book/books.service");
const container = new inversify_1.Container();
// container.bind(BookService).toSelf();
// decorate(injectable(), Book)
// container.bind<typeof Book>('Book').toConstantValue(Book);
(0, inversify_1.decorate)((0, inversify_1.injectable)(), books_service_1.BookService);
container.bind("BOOKS_SERVICE").to(books_service_1.BookService).inSingletonScope();
exports.default = container;
