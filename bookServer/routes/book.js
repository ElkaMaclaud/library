const express = require('express');
const router = express.Router();
const http = require('http');
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
        const postOptions = {
            hostname: process.env.HOST,
            port: 3001,
            path: `/counter/${id}/incr`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        const postRequest = http.request(postOptions, (postResponse) => {
            postResponse.on('data', () => {
            });
             postResponse.on('end', () => {
                try {
                    const getOptions = {
                        hostname: process.env.HOST,
                        port: 3001,
                        path: `/counter/${id}`, 
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    };
    
                    const getRequest = http.request(getOptions, (getResponse) => {
                        let getData = '';
                        getResponse.on('data', (chunk) => {
                            getData += chunk;
                        });
    
                        getResponse.on('end', () => {
                            try {
                                const finalData = JSON.parse(getData);
                                const response = book.toObject();
                                res.render("book/view", {
                                    title: "book | view",
                                    book: {...response, ...finalData},
                                })
                            } catch (error) {
                                console.error("Ошибка при парсинге данных GET:", error);
                                res.status(500).redirect('/404');
                            }
                        });
                    });
    
                    getRequest.on('error', (error) => {
                        console.error("Ошибка при обращении к микросервису (GET):", error);
                        res.status(500).redirect('/404');;
                    });
    
                    getRequest.end();
                } catch (error) {
                    console.error("Ошибка при парсинге данных POST:", error);
                    res.status(500).redirect('/404');
                }
            });
        });
    
        postRequest.on('error', (error) => {
            console.error("Ошибка при обращении к микросервису (POST):", error);
            res.status(500).redirect('/404');;
        });
    
        // postRequest.write(JSON.stringify({}));
        postRequest.end(); 
    } catch(e) {
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
        book.description = book.description.trim()
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

