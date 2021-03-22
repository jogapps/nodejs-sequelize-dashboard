// package imports
const express = require('express');
const flash = require("express-flash-messages");
const passport = require("passport");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

// local imports
const parameters = require("../config/params");
const AuthMiddleware = require("../middlewares/auth_middleware");
const AuthController = require("../controllers/AuthController");
const DashboardController = require("../controllers/DashboardController");


// imports initialization
const router = express.Router();


// middlewares

router.use(passport.initialize());
router.use(passport.session());
router.use(cookieParser());


router.use(cookieSession({
    name: parameters.SESSION_NAME,
    keys: [parameters.SESSION_SECRET, parameters.SESSION_SECRET]
  }))

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

router.use(flash());

// ensuring when users logout they can't go back with back button
router.use(function (req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


router.use(function(req, res, next) {
    res.locals.role = req.session.role;
    next();
  });

// routes
router.get("/", AuthMiddleware.redirectHome, AuthController.index);
router.post("/signin", AuthMiddleware.redirectHome, AuthController.login);
router.get("/home", AuthMiddleware.redirectLogin, DashboardController.home);
router.post("/logout", AuthMiddleware.redirectLogin, AuthController.logout);
router.get("/password", AuthMiddleware.redirectLogin, DashboardController.password);
router.post("/update-password", AuthMiddleware.redirectLogin, AuthController.changePassword);

module.exports = router;