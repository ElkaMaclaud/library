const express = require("express")
const User = require('../../models/User')
const router = express.Router()

router.post("/login", async (req, res) => {
    const { user } = req.body
    res
        .status(201)
        .json({ id: 1, mail: user.mail || "test@mail.ru" })
})
router.post("/register", async (req, res) => {
    const user = req.body
    const newUser = new User(user)
    const userBack = await newUser.save()
    res
        .status(201)
        .json(userBack)
})

module.exports = router