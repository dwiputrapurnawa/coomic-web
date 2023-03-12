const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User");
const {Comic} = require("../models/Comic");
const {Comment} = require("../models/Comment");
const passport = require("passport");
const moment = require("moment")
const mongoose = require("mongoose");

const homePageView = (req, res) => {

    Comic.find({}, (err, topPopular) => {
        if(err) {
            console.log(err);
        } else {
            if(topPopular) {

                let topPopularRating = [];

                topPopular.forEach(popular => {
                    if(popular.rating.length) {
                        const sumOfRatingPopular = popular.rating.map((item) => item.rating).reduce((a, b) => a+b);
                        const ratingPopular = sumOfRatingPopular / popular.rating.length

                    topPopularRating.push(ratingPopular);
                    } else {
                        topPopularRating.push(0)
                    }
                });


                if(req.query.search === undefined) {
                    Comic.find({}, (err, comics) => {
                        if(err) {
                            console.log(err);
                        } else {
                            if(comics) {
                                if(req.user) {
                                    res.render("home", {pageName: "home", user: req.user, comics: comics, moment: moment, topPopular: topPopular, topPopularRating: topPopularRating, sectionTitle: "Latest Update"});
                                } else {
                                    res.render("home", {pageName: "home", user: null, comics: comics, moment: moment, topPopular: topPopular, topPopularRating: topPopularRating, sectionTitle: "Latest Update"});
                                }
                            }
                        }
                    }).sort({updatedAt: -1});
                } else {

                        const searchQuery = req.query.search;


                        Comic.find({title: {$regex: searchQuery, $options: "i"}}, (err, comics) => {
                            if(err) {
                                console.log(err);
                            } else {
                                if(comics) {
                                    if(req.user) {
                                        res.render("home", {pageName: "home", user: req.user, comics: comics, moment: moment, topPopular: topPopular, topPopularRating: topPopularRating, sectionTitle: "Search Result"});
                                    } else {
                                        res.render("home", {pageName: "home", user: null, comics: comics, moment: moment, topPopular: topPopular, topPopularRating: topPopularRating, sectionTitle: "Search Result"});
                                    }
                                }
                            }
                        }).sort({updatedAt: -1});

                }
                

                
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

const comment = async (req, res) => {
    const comment = req.body.comment;
    const comicId = req.body.comicId;
    
    if(req.user) {

        if(req.user.role === "User") {

            const user = await User.findById(req.user.id);

            Comic.findById(comicId, (err, comic) => {
                if(err) {
                    console.log(err);
                } else {
                    if(comic) {

                        
        
                        if(req.body.commentSection === "comic") {

                            const newComment = new Comment({
                                body: comment,
                                writer: user.email,
                                commentSection: req.body.commentSection,
                                parentId: comic._id
                            });

                            newComment.save((err) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    comic.comments.push(newComment);
                                    comic.save((err) => {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            res.redirect("/comics/" + comic.titlePath + "#comment");
                                        }
                                    })
                                }
                            })

                           
                          
                            
                        } else if(req.body.commentSection === "chapter") {

            
                            const chapterIndex = req.body.chapterIndex;

                            const newComment = new Comment({
                                body: comment,
                                writer: user.email,
                                commentSection: req.body.commentSection,
                                parentId: comic.chapters[chapterIndex]._id
                            });

                            newComment.save((err) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    comic.chapters[chapterIndex].comments.push(newComment);
                                    comic.save((err) => {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            res.redirect("/comics/" + comic.titlePath + "/" + comic.chapters[chapterIndex].chapterPath + "#comment");
                                        }
                                    })
                                }
                            })

                          
                        }
        
                    }
                }
            })

            


            
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
    
    
}


module.exports = {
    homePageView,
    loginPageView,
    loginUserPost,
    registerPageView,
    registerUserPost,
    logout,
    comment,
}