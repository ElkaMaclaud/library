import { Router, Request, Response, NextFunction } from 'express';
import container from '../container';
import { BookService } from './books.service';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const service = container.get<BookService>("BOOKS_SERVICE" );
    try {
        const books = await service.getBooks();
        res.json(books);
    } catch (e) {
        next(e);
    }

});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const service = container.get<BookService>("BOOKS_SERVICE" );
    try {
        const book = await service.getBook(req.params.id);
        res.json(book);
    } catch (e) {
        next(e);
    }
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const service = container.get<BookService>("BOOKS_SERVICE" );
    try {
        const newBook = await service.createBook(req.body);
        res.status(201).json(newBook);
    } catch (e) {
        next(e);
    }
});
router.post('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
    const service = container.get<BookService>("BOOKS_SERVICE" );
    try {
        const newBook = await service.updateBook(req.params.id, req.body);
        res.status(201).json(newBook);
    } catch (e) {  
        next(e);
    }
});
router.post('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    const service = container.get<BookService>("BOOKS_SERVICE" );
    try {
        const newBook = await service.createBook(req.body);
        res.status(201).json(newBook);
    } catch (e) {
        next(e);
    }
});
router.get('/:id/download', async (req: Request, res: Response, next: NextFunction) => {
    const service = container.get<BookService>("BOOKS_SERVICE" );
    try {
        await service.downloadBook(req.params.id, res);
    } catch (e) {
        next(e);
    }
});



export default router;