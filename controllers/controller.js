const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User");
const passport = require("passport");

const homePageView = (req, res) => {
    console.log(req.user);

    if(req.user) {
        res.render("home", {pageName: "home", user: req.user});
    } else {
        res.render("home", {pageName: "home", user: null});
    }
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