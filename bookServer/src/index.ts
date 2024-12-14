import("reflect-metadata")
import express from "express"
import path from "path"
// import cors from "cors"
// import mongoose from "mongoose"
import dotenv from "dotenv"
import createSocketServer from "./books/routes/socket"

import errorMiddleware from "./books/middlewares/error.js"

import indexRouter from './books/routes/index';
import userRouter from './books/routes/user';
// import bookRouter from "./routes/book"
import bookApiRouter from "./books/routes/book.routes"
import userApiRouter from "./books/routes/api/user"

import "./mongodb.connection"
import "./infostructure/container"
import "./books/ioc.config"

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs");

app.use('/', userRouter)
app.use('/index', indexRouter)
// app.use('/book', bookRouter)
app.use("/api/user", userApiRouter)
app.use("/api/book", bookApiRouter)

app.use(errorMiddleware)
// app.use((err, req, res, next) => {
//     res.status(500).json({
//         error: err.toString(),
//     })
// })

const start = (async () => {
    try {
        // await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.0dgu9.mongodb.net/library`)
        const server = app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
        createSocketServer(server)
    } catch (error) {
        console.log(`Что-то пошло не так: ${error}`)
    }
})

start()