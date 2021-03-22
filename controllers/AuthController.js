// package imports
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

// local imports
const Admin = require("../models").Admin;

// imports initialization
const Op = Sequelize.Op;


exports.index = (req, res, next) => {
    res.render("auths/login");
}

exports.login = (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    if (email && password) {
        Admin.findOne({
                where: {
                    email: {
                        [Op.eq]: req.body.email
                    }
                }
            })
            .then((admin) => {
                if (admin) {
                    let password = req.body.password;
                    if (bcrypt.compareSync(password, admin.password)) {
                        req.session.userId = admin.id;
                        res.redirect("/home");
                    } else {
                        req.flash('warning', "Invalid credentials");
                        res.redirect("back");
                    }
                } else {
                    req.flash('warning', "Invalid credentials");
                    res.redirect("back");
                }
            })
            .catch(error => {
                req.flash('error', "Try again, something went wrong!");
                res.redirect("back");
            });
    } else {
        req.flash('warning', "Invalid credentials");
        res.redirect("back");
    }
}


exports.changePassword = (req, res, next) => {
    const {
        oldPassword,
        password,
        confirmPassword,
    } = req.body;
    // check if any of them are empty
    if (!oldPassword || !password || !confirmPassword) {
        req.flash('warning', "enter all fields");
        res.redirect("back");
    } else if (confirmPassword != password) {
        req.flash('warning', "passwords must match");
        res.redirect("back");
    } else if (confirmPassword.length < 6 || password.length < 6) {
        req.flash('warning', "passwords must be greater than 5 letters");
        res.redirect("back");
    } else {
        Admin.findOne({
                where: {
                    id: {
                        [Op.eq]: req.session.userId
                    }
                }
            })
            .then(response => {
                if (bcrypt.compareSync(oldPassword, response.password)) {
                    // password correct
                    // update it then
                    let currentPassword = bcrypt.hashSync(password, 10);
                    Admin.update({
                            password: currentPassword
                        }, {
                            where: {
                                id: {
                                    [Op.eq]: req.session.userId
                                }
                            }
                        })
                        .then(response => {
                            req.flash('success', "Password updated successfully");
                            res.redirect("back");
                        })
                        .catch(error => {
                            req.flash('error', "something went wrong");
                            res.redirect("back");
                        });
                } else {
                    req.flash('warning', "incorrect old password");
                    res.redirect("back");
                }
            })
            .catch(error => {
                req.flash('error', "something went wrong" + error);
                res.redirect("back");
            });
    }
}

exports.logout = (req, res, next) => {
    // req.session.destroy(err => {
    //     if (err) {
    //         return res.redirect("/home");
    //     }
    //     res.clearCookie(parameters.SESSION_NAME);
    //     res.redirect("/");
    // });
    req.session = null;
    res.redirect("/");
}