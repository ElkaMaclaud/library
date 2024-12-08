const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv") 

const errorMiddleware = require("./middlewares/error")

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const bookRouter = require("./routes/book")
const bookApiRouter = require("./routes/api/book")
const userApiRouter = require("./routes/api/user")

dotenv.config()
const PORT = process.env.PORT || 3000
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use('/', userRouter)
app.use('/index', indexRouter)
app.use('/book', bookRouter)
app.use("/api/user", userApiRouter)
app.use("/api/book", bookApiRouter)

app.use(errorMiddleware)
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.toString(),
    })
})

const start = (async () => {
    try {
        await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.0dgu9.mongodb.net/library`)
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
    } catch (error) {
        console.log(`Что-то пошло не так: ${error}`)
    }
})

start()