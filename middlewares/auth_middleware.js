const Sequelize = require("sequelize");
// imports initialization
const Op = Sequelize.Op;

exports.redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("/");
    } else {
        next();
    }
}



exports.redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/home");
    } else {
        next();
    }
}
