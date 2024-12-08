const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv") 

const errorMiddleware = require("./middlewares/error")

// const formData = require("express-form-data")

const bookRouter = require("./routes/api/book")
const userRouter = require("./routes/api/user")

dotenv.config()
const PORT = process.env.PORT || 3000
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

const app = express()

// app.use(formData.parse())
app.use(express.json())

app.use("/api/user", userRouter)
app.use("/api/book", bookRouter)

app.use(errorMiddleware)
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.toString(),
    })
})

const start = (async () => {
    try {
        await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.0dgu9.mongodb.net/library`)
        app.listen(PORT, () => console.log(`Сервер запущен на порте ${PORT}`))
    } catch (error) {
        console.log(`Что-то пошло не так: ${error}`)
    }
})

start()