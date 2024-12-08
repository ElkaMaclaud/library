const express = require("express")
const ViewsModel = require("./models/Views")
const mongoose = require("mongoose")
const dotenv = require("dotenv") 

dotenv.config()
const PORT = process.env.PORT || 3001
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

const app = express()

app.post("/counter/:bookId/incr", async (req, res) => {
    const { bookId } = req.params;
    try {
        const objectId = new mongoose.Types.ObjectId(bookId)
        await ViewsModel.updateOne(
            { bookId: objectId },
            { $inc: { count: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true })
        res.status(201).json(true)
    } catch(e) {
        console.log(e)
        res.status(500).json({errorcode: 500, errmsg: "Ошибка!"})
    }
})
app.delete("/counter/:bookId", async (req, res) => {
    const { bookId } = req.params;
    try {
        const objectId = new mongoose.Types.ObjectId(bookId)
        await ViewsModel.deleteOne({ bookId: objectId })
        res.status(201).json(true)
    } catch(e) {
        console.log(e)
        res.status(500).json({errorcode: 500, errmsg: "Ошибка!"})
    }
})
app.get("/counter/:bookId", async (req, res) => {
    const { bookId } = req.params;
    try {
        const objectId = new mongoose.Types.ObjectId(bookId)
        const cnt =  await ViewsModel.findOne({ bookId: objectId })
        res.json({numberOfViews: cnt ? parseInt(cnt.count) : 0})
    } catch(e) {
        console.log(e)
        res.status(500).json({errorcode: 500, errmsg: "Ошибка!"})
    } 
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



// const redis = require("redis")


// // dotenv.config()
// const PORT = process.env.PORT || 3001
// const REDIS_URL = process.env.REDIS_URL || "redis://localhost"

// const client = redis.createClient({ url: REDIS_URL });

// (async () => {
//     await client.connect()
// })()

// const app = express()

// app.post("/counter/:bookId/incr", async (req, res) => {
//     const { bookId } = req.params;
//     try {
//         await client.incr(bookId)
//         res.status(201).json(true)
//     } catch(e) {
//         console.log(e)
//         res.status(500).json({errorcode: 500, errmsg: "Ошибка redis!"})
//     }
    
// })
// app.get("/counter/:bookId", async (req, res) => {
//     const { bookId } = req.params;
//     try {
//         const cnt = await client.get(bookId)
//         res.json({numberOfViews: cnt ? parseInt(cnt) : 0})
//     } catch(e) {
//         console.log(e)
//         res.status(500).json({errorcode: 500, errmsg: "Ошибка redis!"})
//     } 
// })

// const start = (async () => {
//     try {
//         app.listen(PORT, () => console.log(`Сервер запущен на порте ${PORT}`))
//     } catch (error) {
//         console.log(`Что-то пошло не так: ${error}`)
//     }
// })

// start()