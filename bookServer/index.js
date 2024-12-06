const express = require("express")
const cors = require("cors")

const errorMiddleware = require("./middlewares/error")
// const dotenv = require("dotenv") 
// const formData = require("express-form-data")

const bookRouter = require("./routes/book")
const userRouter = require("./routes/user")

// dotenv.config()
const PORT = process.env.PORT || 3000
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
        const server = app.listen(PORT, () => console.log(`Сервер запущен на порте ${PORT}`))
    } catch (error) {
        console.log(`Что-то пошло не так: ${error}`)
    }
})

start()