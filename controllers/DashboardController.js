// package imports
const Sequelize = require("sequelize");
const moment = require("moment");

// local imports



// imports initialization
const Op = Sequelize.Op;


exports.home = (req, res, next) => {
    res.render("dashboards/home");
}

exports.password = (req, res, next) => {
    res.render("dashboards/change_password");
}