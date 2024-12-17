"use strict";
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
const express_1 = require("express");
const http_1 = __importDefault(require("http"));
const book_model_1 = require("../models/book.model");
class BookRepository {
    constructor(book, router) {
        this.book = book;
        this.router = router;
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this.getBooks.bind(this));
        this.router.get('/:id', this.getBook.bind(this));
        this.router.get('/create', this.createBookGet.bind(this));
        this.router.post('/create', this.createBook.bind(this));
    }
    getBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const books = yield this.book.find();
                res.render("book/index", {
                    title: "Books",
                    books,
                });
            }
            catch (error) {
                console.error("Ошибка при получении книг:", error);
                res.status(500).send("Ошибка при получении книг");
            }
        });
    }
    ;
    createBookGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render("book/create", {
                title: "book | create",
                book: {},
            });
        });
    }
    ;
    createBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = req.body;
            const newBook = new book_model_1.Book(book);
            try {
                const newBookCreate = yield newBook.save();
                const response = newBookCreate.toObject();
                if ('__v' in response) {
                    delete response.__v;
                }
                res.redirect('/book');
            }
            catch (e) {
                res.status(500).json({ message: e });
            }
        });
    }
    ;
    getBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
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
                                        const response = book.toObject();
                                        res.render("book/view", {
                                            title: "book | view",
                                            book: Object.assign(Object.assign({}, response), finalData),
                                        });
                                    }
                                    catch (error) {
                                        console.error("Ошибка при парсинге данных GET:", error);
                                        res.status(500).redirect('/404');
                                    }
                                });
                            });
                            getRequest.on('error', (error) => {
                                console.error("Ошибка при обращении к микросервису (GET):", error);
                                res.status(500).redirect('/404');
                                ;
                            });
                            getRequest.end();
                        }
                        catch (error) {
                            console.error("Ошибка при парсинге данных POST:", error);
                            res.status(500).redirect('/404');
                        }
                    });
                });
                postRequest.on('error', (error) => {
                    console.error("Ошибка при обращении к микросервису (POST):", error);
                    res.status(500).redirect('/404');
                    ;
                });
                // postRequest.write(JSON.stringify({}));
                postRequest.end();
            }
            catch (_a) {
                res.status(404).redirect('/404');
            }
        });
    }
    ;
    updateBookGet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const book = yield book_model_1.Book.findById(id);
                res.render("book/update", {
                    title: "book | view",
                    book: book,
                });
            }
            catch (_a) {
                res.status(404).redirect('/404');
            }
        });
    }
    ;
    updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const book = req.body;
            try {
                book.description = book.description.trim();
                yield book_model_1.Book.findByIdAndUpdate(id, book, { new: true, runValidators: true }).select("-__v");
                res.redirect(`/book/${id}`);
            }
            catch (_a) {
                res.status(404).redirect('/404');
            }
        });
    }
    ;
    deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield book_model_1.Book.findByIdAndDelete(id);
                res.redirect(`/book`);
            }
            catch (_a) {
                res.status(404).redirect('/404');
            }
        });
    }
    ;
}
exports.default = BookRepository;
