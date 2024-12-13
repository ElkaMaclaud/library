import("reflect-metadata")
import express from "express"
import path from "path"
// import cors from "cors"
// import mongoose from "mongoose"
import dotenv from "dotenv"
import createSocketServer from "./routes/socket"

import errorMiddleware from "./middlewares/error.js"

import indexRouter from './routes/index';
import userRouter from './routes/user';
// import bookRouter from "./routes/book"
import bookApiRouter from "./routes/book/books.routes"
import userApiRouter from "./routes/api/user"

import "./db_connection"
import "./container"

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