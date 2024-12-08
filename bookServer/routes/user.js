const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const router = express.Router();


router.use(require('express-session')({
  secret: process.env.COOKIE_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
}))

router.use(passport.initialize())
router.use(passport.session())

/**
 * @param {String} username
 * @param {String} password
 * @param {Function} done
 */
async function verify(username, password, done) {
  try {
    const user = await User.findOne({ username })
    if (!user) { return done(null, false) }

    const passwordValid = password === user.password

    if (!passwordValid) {
      return done(null, false)
    }
    // `user` будет сохранен в `req.user`
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}

const options = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: false,
}

//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(options, verify))

// Конфигурирование Passport для сохранения пользователя в сессии
passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id)
    if (!user) { return cb(null, false) }
    return cb(null, user)
  } catch (err) {
    cb(err)
  }
})

router.get('/',
  function (req, res) {
    res.render('user/home', { user: req.user })
  })

router.get('/login',
  function (req, res) {
    res.render('user/login')
  })

router.post('/login',
  passport.authenticate(
    'local',
    {
      failureRedirect: '/login',
    },
  ),
  function (req, res) {
    console.log("req.user: ", req.user)
    res.redirect('/')
  })

router.get('/logout', function (req, res) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/');
  });
});

router.get('/profile',
  function (req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect('/login')
    }
    next()
  },
  function (req, res) {
    res.render('user/profile', { user: req.user })
  })

module.exports = router;