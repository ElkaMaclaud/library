const express = require('express');
const router = express.Router();
const Book = require('../models/Book');


router.get('/', async (req, res) => {
    const books = await Book.find();
    res.render("book/index", {
        title: "book",
        books,
    });
});

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "book | create",
        book: {},
    });
});

router.post('/create', async (req, res) => {
    const book = req.body
    const newBook = new Book(book)
    try {
        const newBookCreate = await newBook.save()
        const response = newBookCreate.toObject();
        delete response.__v;
        res.redirect('/book')
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id).select("-__v")

        res.render("book/view", {
            title: "book | view",
            book: book,
        });
    } catch (e) {
        res.status(404).redirect('/404');
    }
});

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id)
        res.render("book/update", {
            title: "book | view",
            book: book,
        });
    } catch (e) {
        res.status(404).redirect('/404');
    }
});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const book = req.body
    try {
        await Book.findByIdAndUpdate(id, book, { new: true, runValidators: true }).select("-__v")
        res.redirect(`/book/${id}`);
    } catch (e) {
        res.status(404).redirect('/404');
    }
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id)
        res.redirect(`/book`);
    } catch(e) {
        res.status(404).redirect('/404');
    }
});

module.exports = router;

