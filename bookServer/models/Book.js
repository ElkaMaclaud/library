const { Schema, model } = require("mongoose")

const BookModel = new Schema({
    title: { type: String, required: true, default: "" },
    description: { type: String, default: "" },
    authors: { type: String, default: "" },
    favorite: { type: String, default: "" },
    fileCover: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileBook: { type: String, default: "" }
})

module.exports = model("Book", BookModel)