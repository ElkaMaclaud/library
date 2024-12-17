"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const fs_1 = __importDefault(require("fs"));
// import fileMiddleware from "../../middlewares/file"
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const book_model_1 = require("../models/book.model");
const inversify_1 = require("inversify");
const abstract_book_service_1 = require("./abstract.book.service");
dotenv_1.default.config();
let BookService = class BookService extends abstract_book_service_1.AbstractBookService {
    constructor() {
        super();
        //this.book 
    }
    getBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const books = yield book_model_1.Book.find().select("-__v");
            return books;
        });
    }
    getBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_model_1.Book.findById(id).select("-__v");
            const postOptions = {
                hostname: process.env.HOST,
                port: 3001,
                path: `/counter/${id}/incr`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const postRequest = http_1.default.request(postOptions, (postResponse) => {
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
                        const getRequest = http_1.default.request(getOptions, (getResponse) => {
                            let getData = '';
                            getResponse.on('data', (chunk) => {
                                getData += chunk;
                            });
                            getResponse.on('end', () => {
                                try {
                                    const finalData = JSON.parse(getData);
                                    const bookData = book.toObject();
                                    return Object.assign(Object.assign({}, bookData), finalData);
                                }
                                catch (error) {
                                    console.error("Ошибка при парсинге данных GET:", error);
                                    throw { status: 500, message: "Ошибка при получении книги" };
                                }
                            });
                        });
                        getRequest.on('error', (error) => {
                            console.error("Ошибка при обращении к микросервису (GET):", error);
                            throw { status: 500, message: "Ошибка при обращении к микросервису (GET)" };
                        });
                        getRequest.end();
                    }
                    catch (error) {
                        console.error("Ошибка при парсинге данных POST:", error);
                        throw { status: 500, message: "Ошибка при парсинге данных POST" };
                    }
                });
            });
            postRequest.on('error', (error) => {
                console.error("Ошибка при обращении к микросервису (POST):", error);
                throw { status: 500, message: "Ошибка при парсинге данных POST" };
            });
            // postRequest.write(JSON.stringify({}));
            postRequest.end();
        });
    }
    ;
    createBook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBook = new book_model_1.Book(book);
            const newBookCreate = yield newBook.save();
            const response = newBookCreate.toObject();
            if ('__v' in response) {
                delete response.__v;
            }
            return response;
        });
    }
    updateBook(id, book) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBook = yield book_model_1.Book.findByIdAndUpdate(id, book, { new: true, runValidators: true }).select("-__v");
            return newBook;
        });
    }
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield book_model_1.Book.findByIdAndDelete(id);
            const deleteOptions = {
                hostname: process.env.HOST,
                port: 3001,
                path: `/counter/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const deleteRequest = http_1.default.request(deleteOptions, (deletedResponse) => {
                let responseData = '';
                deletedResponse.on('data', (chunk) => {
                    responseData += chunk;
                });
                deletedResponse.on('end', () => {
                    try {
                        const finalData = JSON.parse(responseData);
                        return finalData;
                    }
                    catch (error) {
                        console.error("Ошибка при парсинге данных GET:", error);
                        throw { status: 500, message: "Ошибка при получении книги" };
                    }
                });
            });
            deleteRequest.on('error', (error) => {
                console.error("Ошибка при обращении к микросервису (GET):", error);
                throw { status: 500, message: "Ошибка при обращении к микросервису (GET)" };
            });
            deleteRequest.end();
        });
    }
    downloadBook(id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield book_model_1.Book.findById(id);
            if (book) {
                const filePath = book.fileBook;
                if (fs_1.default.existsSync(filePath)) {
                    res.download(`${filePath}/`, "book.png", err => {
                        if (err) {
                            res.status(404).json();
                        }
                    });
                }
            }
            else {
                throw { status: 404, message: "Book | not found" };
            }
        });
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookService);
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
