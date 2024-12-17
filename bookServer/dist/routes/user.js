"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const User_1 = require("../models/User");
const express_session_1 = __importDefault(require("express-session"));
const router = express_1.default.Router();
const sessionOptions = {
    secret: process.env.COOKIE_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
};
router.use((0, express_session_1.default)(sessionOptions));
router.use(passport_1.default.initialize());
router.use(passport_1.default.session());
function verify(username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User_1.User.findOne({ username });
            if (!user) {
                return done(null, false);
            }
            const passwordValid = password === user.password;
            if (!passwordValid) {
                return done(null, false);
            }
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    });
}
const options = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false,
};
passport_1.default.use('local', new passport_local_1.Strategy(options, verify));
passport_1.default.serializeUser((user, cb) => {
    cb(null, user.id);
});
passport_1.default.deserializeUser((id, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(id);
        if (!user) {
            return cb(null, false);
        }
        return cb(null, user);
    }
    catch (err) {
        cb(err);
    }
}));
router.get('/', (req, res) => {
    res.render('user/home', { user: req.user });
});
router.get('/login', (req, res) => {
    res.render('user/login');
});
router.post('/login', passport_1.default.authenticate('local', {
    failureRedirect: '/login',
}), (req, res) => {
    console.log('req.user: ', req.user);
    res.redirect('/');
});
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect('/');
    });
});
router.get('/profile', (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
            req.session.returnTo = req.originalUrl || req.url;
        }
        return res.redirect('/login');
    }
    next();
}, (req, res) => {
    res.render('user/profile', { user: req.user });
});
exports.default = router;
