import { Schema, SchemaTypes, model } from "mongoose";

const BookModel = new Schema({
    title: SchemaTypes.String,
    description: SchemaTypes.String,
    authors: [SchemaTypes.String],
    favorite: SchemaTypes.String,
    fileCover: SchemaTypes.String,
    fileName: SchemaTypes.String,
    fileBook: SchemaTypes.String
});


export default model("Book", BookModel);