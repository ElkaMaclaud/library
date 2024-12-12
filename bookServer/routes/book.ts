import { Request, Response, Router } from 'express';
import http from 'http';
import Book from "../models/Book"

export interface IBook {
    title: string,
    description: string,
    authors: string,
    favorite?: string,
    fileCover?: string,
    fileName?: string,
    fileBook: string
}

class BookRepository {
    constructor(private book: typeof Book, private router: Router) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get('/', this.getBooks.bind(this));
        this.router.get('/:id', this.getBook.bind(this));
        this.router.get('/create', this.createBookGet.bind(this));
        this.router.post('/create', this.createBook.bind(this));
    }


    async getBooks(req: Request, res: Response): Promise<void> {
        try {
            const books: IBook[] = await this.book.find();
            res.render("book/index", {
                title: "Books",
                books,
            });
        } catch (error) {
            console.error("Ошибка при получении книг:", error);
            res.status(500).send("Ошибка при получении книг");
        }
    };

    async createBookGet(req: Request, res: Response) {
        res.render("book/create", {
            title: "book | create",
            book: {},
        });
    };

    async createBook(req: Request, res: Response) {
        const book = req.body
        const newBook = new Book(book)
        try {
            const newBookCreate = await newBook.save()
            const response = newBookCreate.toObject();
            if ('__v' in response) {
                delete response.__v;
            }
            res.redirect('/book')
        } catch (e) {
            res.status(500).json({ message: e });
        }
    };

    async getBook(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const book = await Book.findById(id).select("-__v")
            const postOptions = {
                hostname: process.env.HOST,
                port: 3001,
                path: `/counter/${id}/incr`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const postRequest = http.request(postOptions, (postResponse) => {
                postResponse.on('data', () => {
                });
                postResponse.on('end', () => {
                    try {
                        const getOptions = {
                            hostname: process.env.HOST,
                            port: 3001,
                            path: `/counter/${id}`,
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        };

                        const getRequest = http.request(getOptions, (getResponse) => {
                            let getData = '';
                            getResponse.on('data', (chunk) => {
                                getData += chunk;
                            });

                            getResponse.on('end', () => {
                                try {
                                    const finalData = JSON.parse(getData);
                                    const response = book.toObject();
                                    res.render("book/view", {
                                        title: "book | view",
                                        book: { ...response, ...finalData },
                                    })
                                } catch (error) {
                                    console.error("Ошибка при парсинге данных GET:", error);
                                    res.status(500).redirect('/404');
                                }
                            });
                        });

                        getRequest.on('error', (error) => {
                            console.error("Ошибка при обращении к микросервису (GET):", error);
                            res.status(500).redirect('/404');;
                        });

                        getRequest.end();
                    } catch (error) {
                        console.error("Ошибка при парсинге данных POST:", error);
                        res.status(500).redirect('/404');
                    }
                });
            });

            postRequest.on('error', (error) => {
                console.error("Ошибка при обращении к микросервису (POST):", error);
                res.status(500).redirect('/404');;
            });

            // postRequest.write(JSON.stringify({}));
            postRequest.end();
        } catch {
            res.status(404).redirect('/404');
        }
    };

    async updateBookGet(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const book = await Book.findById(id)
            res.render("book/update", {
                title: "book | view",
                book: book,
            });
        } catch {
            res.status(404).redirect('/404');
        }
    };

    async updateBook(req: Request, res: Response) {
        const { id } = req.params;
        const book = req.body
        try {
            book.description = book.description.trim()
            await Book.findByIdAndUpdate(id, book, { new: true, runValidators: true }).select("-__v")
            res.redirect(`/book/${id}`);
        } catch {
            res.status(404).redirect('/404');
        }
    };

    async deleteBook(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await Book.findByIdAndDelete(id)
            res.redirect(`/book`);
        } catch {
            res.status(404).redirect('/404');
        }
    };

}


export default BookRepository

