import express, { Request, Response, NextFunction, Router } from 'express';
import passport from 'passport';
import { IStrategyOptions, Strategy as LocalStrategy } from 'passport-local';
import { IUser, User} from '../models/User';
import session, { SessionOptions } from 'express-session';

const router: Router = express.Router();


const sessionOptions: SessionOptions = {
  secret: process.env.COOKIE_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
};
router.use(session(sessionOptions));


router.use(passport.initialize());
router.use(passport.session());


async function verify(username: string, password: string, done: (error: any, user?: any, options?: { message: string }) => void): Promise<void> {
  try {
    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      return done(null, false);
    }

    const passwordValid: boolean = password === user.password;
    if (!passwordValid) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

const options: IStrategyOptions = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: false,
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser((user: any, cb: (err: any, id?: unknown) => void) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id: string, cb) => {
  try {
    const user: IUser | null = await User.findById(id);
    if (!user) {
      return cb(null, false);
    }
    return cb(null, user);
  } catch (err) {
    cb(err);
  }
});

declare module 'express-session' {
  interface SessionData {
    returnTo?: string; // Добавляем свойство returnTo
  }
}

router.get('/', (req: Request, res: Response) => {
  res.render('user/home', { user: req.user });
});

router.get('/login', (req: Request, res: Response) => {
  res.render('user/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req: Request, res: Response) => {
    console.log('req.user: ', req.user);
    res.redirect('/');
  }
);

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/');
  });
});

router.get(
  '/profile',
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.redirect('/login');
    }
    next();
  },
  (req: Request, res: Response) => {
    res.render('user/profile', { user: req.user });
  }
);

export default router;