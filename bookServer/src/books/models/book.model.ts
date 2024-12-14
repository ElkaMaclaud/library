import { Schema, SchemaTypes, model } from "mongoose";
import { BookInterface } from "../../domain/book.interface";

const BookModel = new Schema({
    title: SchemaTypes.String,
    description: SchemaTypes.String,
    authors: [SchemaTypes.String],
    favorite: SchemaTypes.String,
    fileCover: SchemaTypes.String,
    fileName: SchemaTypes.String,
    fileBook: SchemaTypes.String
});


export const Book = model<BookInterface & Document>("Book", BookModel);