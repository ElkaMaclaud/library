import { AbstractBookService } from "./services/abstract.book.service";
import { BookService } from "./services/mongo.book.service";
import iocContainer from "../infostructure/container";

// decorate(injectable(), Book)
// iocContainer.bind<typeof Book>('Book').toConstantValue(Book);
// decorate(injectable(), BookService)
// iocContainer.bind(BookService).toSelf().inSingletonScope();

// iocContainer.bind<BookService>(BOOKS_SERVICE).to(BookService).inSingletonScope()

iocContainer.bind(AbstractBookService).to(BookService).inSingletonScope();