const {Comic} = require("../models/Comic");
const {Chapter} = require("../models/Chapter");
const User = require("../models/User");
const moment = require("moment");

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


                            if(req.user) {

                                if(req.user.role === "User") {
                                    User.findById(req.user.id, (err, user) => {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            if(user) {
                                                res.render("comics/comic", {pageName: "comics", comic: foundComic,  user: user, topPopular: topPopular, moment: moment});
                                            }
                                        }
                                    })
                                } else {
                                    res.render("comics/comic", {pageName: "comics", comic: foundComic,  user: null, topPopular: topPopular, moment: moment});
                                }
                               

                            } else {
                                res.render("comics/comic", {pageName: "comics", comic: foundComic,  user: null, topPopular: topPopular, moment: moment});
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

    Comic.findOne({titlePath: titlePath}, (err, comic) => {
        if(err) {
            console.log(err);
        } else {
            if(comic) {
                res.render("comics/read_comic", {pageName: "comics", comic: comic, user: null, chapterPath: chapterPath});
            }
        }
    })

}

const addBookmark = (req, res) => {

    const comicId = req.body.comicId;

    Comic.findById(comicId, (err, comic) => {
        if(err) {
            console.log(err);
        } else {
            if(comic) {

                console.log("Comic exist");

                if(req.user) {

                    if(req.user.id) {

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
                    }
                } else {
                    res.redirect("/login")
                }
                
                

            } else {
                console.log("Comic doesnt exist");
            }
        }
    })
}

module.exports = {
    comicPageView,
    singlePageComicView,
    readComicView,
    addBookmark,
}