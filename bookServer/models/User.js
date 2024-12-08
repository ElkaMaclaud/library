const { Schema, model } = require("mongoose")

const UserModel = new Schema({
    username: { type: String, required: true, default: "" },
    displayName: { type: String, default: "" },
    emails: {  type: [{ value: { type: String } }], default: [] },
    password: { type: String, required: true },
})

module.exports = model("User", UserModel)