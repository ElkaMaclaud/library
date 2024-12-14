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
exports.InMemoryService = void 0;
// import fileMiddleware from "../../middlewares/file"
const dotenv_1 = __importDefault(require("dotenv"));
const book_model_1 = require("../models/book.model");
const inversify_1 = require("inversify");
const abstract_book_service_1 = require("./abstract.book.service");
dotenv_1.default.config();
let InMemoryService = class InMemoryService extends abstract_book_service_1.AbstractBookService {
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
            return book;
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
        return __awaiter(this, void 0, void 0, function* () { return; });
    }
    ;
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    ;
    downloadBook(id, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    ;
};
exports.InMemoryService = InMemoryService;
exports.InMemoryService = InMemoryService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], InMemoryService);
