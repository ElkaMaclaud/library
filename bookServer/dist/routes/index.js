"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.render("index", {
        title: "Главная",
    });
});
exports.default = router;
