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
const container_1 = __importDefault(require("../infostructure/container"));
const abstract_book_service_1 = require("../services/abstract.book.service");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const service = container_1.default.get(abstract_book_service_1.AbstractBookService);
    try {
        const books = yield service.getBooks();
        res.json(books);
    }
    catch (e) {
        next(e);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const service = container_1.default.get(abstract_book_service_1.AbstractBookService);
    try {
        const book = yield service.getBook(req.params.id);
        res.json(book);
    }
    catch (e) {
        next(e);
    }
}));
router.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const service = container_1.default.get(abstract_book_service_1.AbstractBookService);
    try {
        const newBook = yield service.createBook(req.body);
        res.status(201).json(newBook);
    }
    catch (e) {
        next(e);
    }
}));
router.post('/update/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const service = container_1.default.get(abstract_book_service_1.AbstractBookService);
    try {
        const newBook = yield service.updateBook(req.params.id, req.body);
        res.status(201).json(newBook);
    }
    catch (e) {
        next(e);
    }
}));
router.post('/delete/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const service = container_1.default.get(abstract_book_service_1.AbstractBookService);
    try {
        const newBook = yield service.createBook(req.body);
        res.status(201).json(newBook);
    }
    catch (e) {
        next(e);
    }
}));
router.get('/:id/download', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const service = container_1.default.get(abstract_book_service_1.AbstractBookService);
    try {
        yield service.downloadBook(req.params.id, res);
    }
    catch (e) {
        next(e);
    }
}));
exports.default = router;
