import { Request } from "express";
import multer, { StorageEngine, FileFilterCallback } from "multer";


const storage: StorageEngine = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb) {
        cb(null, "public/img");
    },
    filename(req: Request, file: Express.Multer.File, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const allowedTypes = ["book/txt", "book/pdf", "book/epub", "book/doc", "book/docx", "book/png"];


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export default multer({ fileFilter, storage });