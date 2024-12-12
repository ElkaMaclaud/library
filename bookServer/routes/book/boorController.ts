import { Router, Request, Response, NextFunction } from 'express';
import container from '../container';
import { BookRepository } from './bookService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const repo = container.get(BookRepository);
    try {
        const books = await repo.getBooks();
        res.json(books);
    } catch (e) {
        next(e);
    }

});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const repo = container.get(BookRepository);
    try {
        const book = await repo.getBook(req.params.id);
        res.json(book);
    } catch (e) {
        next(e);
    }
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const repo = container.get(BookRepository);
    try {
        const newBook = await repo.createBook(req.body);
        res.status(201).json(newBook);
    } catch (e) {
        next(e);
    }
});
router.post('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
    const repo = container.get(BookRepository);
    try {
        const newBook = await repo.updateBook(req.params.id, req.body);
        res.status(201).json(newBook);
    } catch (e) {
        next(e);
    }
});
router.post('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    const repo = container.get(BookRepository);
    try {
        const newBook = await repo.createBook(req.body);
        res.status(201).json(newBook);
    } catch (e) {
        next(e);
    }
});
router.get('/:id/download', async (req: Request, res: Response, next: NextFunction) => {
    const repo = container.get(BookRepository);
    try {
        await repo.downloadBook(req.params.id, res);
    } catch (e) {
        next(e);
    }
});



export default router;