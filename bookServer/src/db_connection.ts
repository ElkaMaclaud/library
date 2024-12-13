import mongoose from "mongoose";
import dotenv from "dotenv" 

dotenv.config()

const MONGO_USER = process.env.MONGO_USER
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.0dgu9.mongodb.net/library`)

mongoose.connection.on("open", () => {
    console.log("Connected to mongodb", MONGO_USER)
})

