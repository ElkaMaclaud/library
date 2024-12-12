import fs from "fs"
// import fileMiddleware from "../../middlewares/file"
import dotenv from "dotenv"
import { Request, Response, Router } from 'express';
import http from 'http';
import Book from "../../models/Book"

dotenv.config()

// const library = {
//     Book: []
// }
// const l = [1, 2, 3]
// l.map(el => {
//     const fileBook = path.join(__dirname + `/../public/book.png`)
//     const newBook = new Book(
//         `Book ${el}`,
//         `desc Book ${el}`,
//         `desc Book ${el}`,
//         `desc Book ${el}`,
//         `desc Book ${el}`,
//         `desc Book ${el}`,
//         fileBook)
//     library.Book.push(newBook)
// })


export interface IBook {
    title: string,
    description: string,
    authors: string,
    favorite?: string,
    fileCover?: string,
    fileName?: string,
    fileBook: string
}

export class BookRepository {
    constructor(private book: typeof Book, private router: Router) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get('/', this.getBooks.bind(this)); 
        this.router.get('/:id', this.getBook.bind(this)); 
        this.router.post('/create', this.createBook.bind(this));
        this.router.put('/:id', this.updateBook.bind(this));
        this.router.delete('/:id', this.deleteBook.bind(this));
        this.router.get("/:id/download", this.getBooks.bind(this)); 
    }



async getBooks(req: Request, res: Response) {
    const book = await this.book.find().select("-__v")
    res.json(book)
}

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
                                const bookData = book.toObject()
                                res.json({ ...bookData, ...finalData }); 
                            } catch (error) {
                                console.error("Ошибка при парсинге данных GET:", error);
                                res.status(500).json({ error: "Ошибка при парсинге данных GET" });
                            }
                        });
                    });

                    getRequest.on('error', (error) => {
                        console.error("Ошибка при обращении к микросервису (GET):", error);
                        res.status(500).json({ error: "Ошибка при обращении к микросервису (GET)" });
                    });

                    getRequest.end();
                } catch (error) {
                    console.error("Ошибка при парсинге данных POST:", error);
                    res.status(500).json({ error: "Ошибка при парсинге данных POST" });
                }
            });
        });

        postRequest.on('error', (error) => {
            console.error("Ошибка при обращении к микросервису (POST):", error);
            res.status(500).json({ error: "Ошибка при обращении к микросервису (POST)" });
        });

        // postRequest.write(JSON.stringify({}));
        postRequest.end(); 
    } catch {
        res.status(404).json("Book | not found");
    }
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
    res
        .status(201)
        .json(response)  
    } catch(e: unknown) {
        res.status(500).json({message: e});
    } 
}

async updateBook(req: Request, res: Response){
    const { id } = req.params
    const book = req.body
    try {
        const newBook = await Book.findByIdAndUpdate(id, book, { new: true, runValidators: true }).select("-__v")
        res.json(newBook)
    } catch {
        res
            .status(404)
            .json("Book | not found")
    }
}
async deleteBook(req: Request, res: Response) {
    const { id } = req.params
    try {
        await Book.findByIdAndDelete(id)

        const deleteOptions = {
            hostname: process.env.HOST,
            port: 3001,
            path: `/counter/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const deleteRequest = http.request(deleteOptions, (deletedResponse) => {
            let responseData = '';

            deletedResponse.on('data', (chunk) => {
                responseData += chunk;
            });
            deletedResponse.on('end', () => { 
                try {
                    const finalData = JSON.parse(responseData);
                    res.json(finalData); 
                } catch (error) {
                    console.error("Ошибка при парсинге данных GET:", error);
                    res.status(500).json({ error: "Ошибка при парсинге данных GET" });
                }
            })
        })
        deleteRequest.on('error', (error) => {
            console.error("Ошибка при обращении к микросервису (GET):", error);
            res.status(500).json({ error: "Ошибка при обращении к микросервису (GET)" });
        });
        deleteRequest.end()
    } catch {
        res
            .status(404)
            .json("Book | not found")
    }
}

async downloadBook(req: Request, res: Response) {
    const { id } = req.params
    const book = await Book.findById(id)
    if (book) {
        const filePath = book.fileBook
        if (fs.existsSync(filePath)) {
            res.download(`${filePath}/`, "book.png", err => {
                if (err) {
                    res.status(404).json()
                }
            })
        }
    } else {
        res
            .status(404)
            .json("Book | not found")
    }
}

}


// const { Book } = require("../models")
// const library = {
//     Book: []
// }
// const l = [1, 2, 3]
// l.map(el => {
//     const fileBook = path.join(__dirname + `/../public/book.png`)
//     const newBook = new Book(
//         `Book ${el}`,
//         `desc Book ${el}`,
//         `desc Book ${el}`,
//         `desc Book ${el}`,
//         `desc Book ${el}`,
//         `desc Book ${el}`,
//         fileBook)
//     library.Book.push(newBook)
// })

// router.get("/", (req: Request, res: Response) => {
//     const { Book } = library
//     res.json(Book)
// })

// router.get("/:id", (req: Request, res: Response) => {
//     const { id } = req.params;
//     const idx = library.Book.findIndex(el => el.id === id);
    
//     if (idx > -1) {
//         const book = library.Book[idx];

//         const postOptions = {
//             hostname: 'server_counter',
//             port: 3001,
//             path: `/counter/${id}/incr`,
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         };


//         const postRequest = http.request(postOptions, (postResponse) => {
//             let postData = '';

//             postResponse.on('data', (chunk) => {
//                 postData += chunk;
//             });

//             postResponse.on('end', () => {
//                 try {
//                     const getOptions = {
//                         hostname: 'server_counter',
//                         port: 3001,
//                         path: `/counter/${id}`, 
//                         method: 'GET',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                     };

//                     const getRequest = http.request(getOptions, (getResponse) => {
//                         let getData = '';
//                         getResponse.on('data', (chunk) => {
//                             getData += chunk;
//                         });

//                         getResponse.on('end', () => {
//                             try {
//                                 const finalData = JSON.parse(getData);
//                                 res.json({ book, counterData: finalData }); 
//                             } catch (error) {
//                                 console.error("Ошибка при парсинге данных GET:", error);
//                                 res.status(500).json({ error: "Ошибка при парсинге данных GET" });
//                             }
//                         });
//                     });

//                     getRequest.on('error', (error) => {
//                         console.error("Ошибка при обращении к микросервису (GET):", error);
//                         res.status(500).json({ error: "Ошибка при обращении к микросервису (GET)" });
//                     });

//                     getRequest.end();
//                 } catch (error) {
//                     console.error("Ошибка при парсинге данных POST:", error);
//                     res.status(500).json({ error: "Ошибка при парсинге данных POST" });
//                 }
//             });
//         });

//         postRequest.on('error', (error) => {
//             console.error("Ошибка при обращении к микросервису (POST):", error);
//             res.status(500).json({ error: "Ошибка при обращении к микросервису (POST)" });
//         });

//         postRequest.write(JSON.stringify({}));
//         postRequest.end(); 
//     } else {
//         res.status(404).json("Book | not found");
//     }
// });
// router.post("/", (req, res) => {
//     const book = req.body
//     const newBook = new Book(book)
//     library.Book.push(newBook)
//     res
//         .status(201)
//         .json(newBook)
// })
// router.put("/:id", (req, res) => {
//     const { id } = req.params
//     const book = req.body
//     const idx = library.Book.findIndex(el => el.id === id)
//     if (idx > -1) {
//         library.Book[idx] = {
//             ...library.Book[idx], ...book
//         }
//         res.json(library.Book[idx])
//     } else {
//         res
//             .status(404)
//             .json("Book | not found")
//     }
// })
// router.delete("/:id", (req, res) => {
//     const { id } = req.params
//     const idx = library.Book.findIndex(el => el.id === id)
//     if (idx > -1) {
//         library.Book.splice(idx, 1)
//         res.json(true)
//     } else {
//         res
//             .status(404)
//             .json("Book | not found")
//     }
// })

// router.get("/:id/download", (req, res) => {
//     const { id } = req.params
//     const idx = library.Book.findIndex(book => book.id === id)
//     if (idx > -1) {
//         const filePath = library.Book[idx].fileBook
//         if (fs.existsSync(filePath)) {
//             res.download(`${filePath}/`, "book.png", err => {
//                 if (err) {
//                     res.status(404).json()
//                 }
//             })
//         }
//     } else {
//         res
//             .status(404)
//             .json("Book | not found")
//     }
// })