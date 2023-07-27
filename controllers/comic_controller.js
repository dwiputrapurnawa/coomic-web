const {Comic} = require("../models/Comic");
const {Chapter} = require("../models/Chapter");
const {Rating} = require("../models/Rating");
const User = require("../models/User");
const moment = require("moment");
const _ = require("lodash");

const comicPageView = (req, res) => {

    if(req.query.genres != undefined) {
       Comic.find({}).distinct("genres", (err, genres) => {
        if(err) {
            console.log(err);
        } else {
            if(genres) {

                const genresSelected = req.query.genres.split(",");
                const statusSelected = req.query.status;
                const typeSelected = req.query.type;
                const orderSelected = req.query.order.toLowerCase();
        
                const status = ["Ongoing", "Complete", "Hiatus", "Dropped", "Coming Soon"];
                const type = ["Manga", "Manhwa", "Manhua"]
                const order = ["Ascending", "Descending"]


        
                Comic.find({$and: [{$or: [{genres: {$all: genresSelected}}, {status: statusSelected}]}, {type: typeSelected}]}, (err, comics) => {
                    if(err) {
                        console.log(err);
                    } else {
                        if(comics) {
                            if(req.user) {
                                res.render("comics/comics", {pageName: "comics", genres: genres, status: status, type: type, order: order, user: req.user, comics: comics});
                            } else {
                                res.render("comics/comics", {pageName: "comics", genres: genres, status: status, type: type, order: order, user: null, comics: comics});
                            }
                        }
                    }
                }).sort({"title": orderSelected})
            }
        }
       })


    } else {
        Comic.find({}).distinct("genres", (err, genres) => {
            if(err) {
                console.log(err);
            } else {
                if(genres) {
                    const status = ["Ongoing", "Complete", "Hiatus", "Dropped", "Coming Soon"];
                    const type = ["Manga", "Manhwa", "Manhua"]
                    const order = ["Ascending", "Descending"]
                
                    Comic.find({}, (err, comics) => {
                        if(err) {
                            console.log(err);
                        } else {
                            if(comics) {
                                if(req.user) {
                                    res.render("comics/comics", {pageName: "comics", genres: genres, status: status, type: type, order: order, user: req.user, comics: comics});
                                } else {
                                    res.render("comics/comics", {pageName: "comics", genres: genres, status: status, type: type, order: order, user: null, comics: comics});
                                }
                            }
                        }
                    })
                }
            }
        })
    }

    

   

    
}

const singlePageComicView = (req, res) => {

    const titlePath = req.params.titlePath;

    Comic.find({}, (err, topPopular) => {
        if(err) {
            console.log(err);
        } else {
            if(topPopular) {
                Comic.findOne({titlePath: titlePath}, (err, foundComic) => {
                    if(err) {
                        console.log(err);
                    } else {
                        if(foundComic) {

                            let rating;

                            if(foundComic.rating.length) {
                                const sumOfRating = foundComic.rating.map((item) => item.rating).reduce((a, b) => a+b);
                                rating = sumOfRating / foundComic.rating.length
                            } else {
                                rating = 0;
                            }

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

                            

                            if(req.user) {

                                User.findById(req.user.id, (err, user) => {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        if(user) {
                                            res.render("comics/comic", {pageName: "comics", comic: foundComic, user: user, topPopular: topPopular, moment: moment, rating: rating, topPopularRating: topPopularRating});
                                        }
                                    }
                                })
                               

                            } else {
                                res.render("comics/comic", {pageName: "comics", comic: foundComic, user: null, topPopular: topPopular, moment: moment, rating: rating, topPopularRating: topPopularRating});
                            }
                        }
                    }
                })
            }
        }
    }).sort({rating: -1}).limit(5);

   
}

const readComicView = (req, res) => {
    const chapterPath = req.params.chapterPath;
    const titlePath = req.params.titlePath;
    var user;

    if(req.user) {
        user = req.user
    }

    Comic.findOne({titlePath: titlePath}, (err, comic) => {
        if(err) {
            console.log(err);
        } else {
            if(comic) {
                res.render("comics/read_comic", {pageName: "comics", comic: comic, user: user, chapterPath: chapterPath, moment: moment});
            }
        }
    })

}

const addBookmark = (req, res) => {
    if(req.isAuthenticated()) {
        const comicId = req.body.comicId;

    Comic.findById(comicId, (err, comic) => {
        if(err) {
            console.log(err);
        } else {
            if(comic) {

                console.log("Comic exist");

                const userId = req.user.id;

                User.findById(userId, (err, user) => {
                    if(err) {
                        console.log(err);
                    } else {
                        if(user) {

                            if(user.bookmark.findIndex((bookmarkComic) => bookmarkComic.title === comic.title) === -1) {
                                user.bookmark.push(comic);
                                user.save((err) => {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        res.redirect("/comics/" + comic.titlePath);
                                    }
                                });
                            } else {
                                const indexComic = user.bookmark.findIndex((bookmarkComic) => bookmarkComic.title === comic.title);
                                user.bookmark.splice(indexComic, 1);
                                user.save((err) => {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        res.redirect("/comics/" + comic.titlePath);
                                    }
                                });
                            }

                            
                        }
                    }
                })
                
                

            } else {
                console.log("Comic doesnt exist");
            }
        }
    })
    } else {
        res.redirect("/login")
    }
}

const submitRating = async (req, res) => {
    
    if(req.isAuthenticated()) {
        const rating = req.body.ratingNumber;
        const comicId = req.body.comicId;

        const user = await User.findById(req.user.id);

            Comic.findById(comicId, (err, comic) => {
                if(err) {
                    console.log(err);
                } else {
                    if(comic) {

                        ratingIndex = comic.rating.findIndex((rating) => rating.userEmail === user.email);

                        const newRating = new Rating({
                            rating: rating,
                            userEmail: user.email,
                            comicId: comicId
                        });

                        if(ratingIndex === -1) {
    
                            newRating.save((err) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    comic.rating.push(newRating);
                                    comic.save((err) => {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            res.redirect("/comics/" + comic.titlePath);
                                        }
                                    })
                                }
                            })
                        } else {

                            Rating.findOneAndDelete({userEmail: user.email}, (err) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    newRating.save((err) => {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            comic.rating[ratingIndex] = newRating;
                                            comic.save((err) => {
                                                if(err) {
                                                    console.log(err);
                                                } else {
        
                                                    res.redirect("/comics/" + comic.titlePath);
                                                }
                                            })
                                        }
                                    })
                                }
                            })

 
                        }


                    }
                }
            })
    } else {
        res.redirect("/login")
    }

   
}


const bookmarkView = async (req, res) => {
    if(req.isAuthenticated()) {
        User.findById(req.user.id, (err, user) => {
            if(err) {
                console.log(err);
            } else {
                if(user) {

                    res.render("bookmark", {pageName: "comics", user: user})
                }
            }
        }).populate("bookmark");
    } else {
        res.redirect("/");
    }
}


module.exports = {
    comicPageView,
    singlePageComicView,
    readComicView,
    addBookmark,
    submitRating,
    bookmarkView,
}