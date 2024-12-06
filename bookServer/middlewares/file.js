const multer = require("multer")

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "public/img")
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const allowedTypes = ["book/txt", "book/pdf", "book/epub", "book/doc", "book/docx", "book/png"]

const fileFilter = (req, file, cb) => {
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({fileFilter, storage})

