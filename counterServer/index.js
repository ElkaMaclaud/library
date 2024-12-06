const express = require("express")
const redis = require("redis")


// dotenv.config()
const PORT = process.env.PORT || 3001
const REDIS_URL = process.env.REDIS_URL || "redis://localhost"

const client = redis.createClient({ url: REDIS_URL });

(async () => {
    await client.connect()
})()

const app = express()

app.post("/counter/:bookId/incr", async (req, res) => {
    const { bookId } = req.params;
    try {
        await client.incr(bookId)
        res.status(201).json(true)
    } catch(e) {
        console.log(e)
        res.status(500).json({errorcode: 500, errmsg: "Ошибка redis!"})
    }
    
})
app.get("/counter/:bookId", async (req, res) => {
    const { bookId } = req.params;
    try {
        const cnt = await client.get(bookId)
        res.json({numberOfViews: cnt ? parseInt(cnt) : 0})
    } catch(e) {
        console.log(e)
        res.status(500).json({errorcode: 500, errmsg: "Ошибка redis!"})
    } 
})

const start = (async () => {
    try {
        app.listen(PORT, () => console.log(`Сервер запущен на порте ${PORT}`))
    } catch (error) {
        console.log(`Что-то пошло не так: ${error}`)
    }
})

start()