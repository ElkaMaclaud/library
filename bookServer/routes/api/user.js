const express = require("express")
const router = express.Router()

router.post("/login", (req, res) => {
    const { user } = req.body
    res
        .status(201)
        .json({ id: 1, mail: user.mail || "test@mail.ru" })
})

module.exports = router