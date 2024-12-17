"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Promise.resolve().then(() => __importStar(require("reflect-metadata")));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// import cors from "cors"
// import mongoose from "mongoose"
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = __importDefault(require("./routes/socket"));
const error_js_1 = __importDefault(require("./middlewares/error.js"));
const index_1 = __importDefault(require("./routes/index"));
const user_1 = __importDefault(require("./routes/user"));
// import bookRouter from "./routes/book"
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const user_2 = __importDefault(require("./routes/api/user"));
require("./mongodb.connection");
require("./infostructure/container");
require("./ioc.config");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use('/', user_1.default);
app.use('/index', index_1.default);
// app.use('/book', bookRouter)
app.use("/api/user", user_2.default);
app.use("/api/book", book_routes_1.default);
app.use(error_js_1.default);
// app.use((err, req, res, next) => {
//     res.status(500).json({
//         error: err.toString(),
//     })
// })
const start = (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.0dgu9.mongodb.net/library`)
        const server = app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
        (0, socket_1.default)(server);
    }
    catch (error) {
        console.log(`Что-то пошло не так: ${error}`);
    }
}));
start();
