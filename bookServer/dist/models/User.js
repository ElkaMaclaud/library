"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserModel = new mongoose_1.Schema({
    username: { type: String, required: true, default: "" },
    displayName: { type: String, default: "" },
    emails: { type: [{ value: { type: String } }], default: [] },
    password: { type: String, required: true },
});
exports.User = (0, mongoose_1.model)("User", UserModel);
