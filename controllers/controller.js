const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User");
const {Comic} = require("../models/Comic");
const passport = require("passport");
const moment = require("moment")

const homePageView = (req, res) => {

    Comic.find({}, (err, topPopular) => {
        if(err) {
            console.log(err);
        } else {
            if(topPopular) {
                Comic.find({}, (err, comics) => {
                    if(err) {
                        console.log(err);
                    } else {
                        if(comics) {
                            if(req.user) {
                                res.render("home", {pageName: "home", user: req.user, comics: comics, moment: moment, topPopular: topPopular});
                            } else {
                                res.render("home", {pageName: "home", user: null, comics: comics, moment: moment, topPopular: topPopular});
                            }
                        }
                    }
                }).sort({updatedAt: -1});
            }
        }
    }).sort({rating: -1}).limit(5);

    

   
};

const loginPageView = (req, res) => {
    res.render("login");
}

const loginUserPost = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = new User({
        email: email,
        password: password
    });

    req.login(user, err => {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("user-login", {failureRedirect: "/login"})(req, res, () => {
                res.redirect("/");
            })
        }
    })
}

const registerPageView = (req, res) => {
    res.render("register");
}

const registerUserPost = (req, res) => {
    
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.log(err);
        } else {
            const newUser = new User({
                email: email,
                password: hash,
                role: "User"
            });

            newUser.save(err => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Success created new user");
                    req.login(newUser, err => {
                        if(err) {
                            console.log(err);
                        } else {
                            passport.authenticate("user-login", {failureRedirect: "/register"})(req, res, () => {
                                res.redirect("/");
                            });
                        }
                    });
                }
            });
        }
    });

}

const logout = (req, res) => {
    req.logout(err => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/")
        }
    })
}

module.exports = {
    homePageView,
    loginPageView,
    loginUserPost,
    registerPageView,
    registerUserPost,
    logout,
}