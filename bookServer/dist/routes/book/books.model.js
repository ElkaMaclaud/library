"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const BookModel = new mongoose_1.Schema({
    title: mongoose_1.SchemaTypes.String,
    description: mongoose_1.SchemaTypes.String,
    authors: [mongoose_1.SchemaTypes.String],
    favorite: mongoose_1.SchemaTypes.String,
    fileCover: mongoose_1.SchemaTypes.String,
    fileName: mongoose_1.SchemaTypes.String,
    fileBook: mongoose_1.SchemaTypes.String
});
exports.Book = (0, mongoose_1.model)("Book", BookModel);
