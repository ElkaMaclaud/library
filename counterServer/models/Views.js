const { Schema, model } = require("mongoose")

const ViewsModel = new Schema({
    count: { type: Number, require: true },
    bookId: { type: Schema.Types.ObjectId, require: true }
})

module.exports = model("View", ViewsModel)