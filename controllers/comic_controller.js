const {Comic} = require("../models/Comic");
const {Chapter} = require("../models/Chapter");

const comicPageView = (req, res) => {

    const genres = ["action","adventure","romance"];
    const status = ["ongoing", "completed", "hiatus", "dropped", "coming soon"];
    const type = ["manga", "manhwa", "manhua"];
    const order = ["A-Z", "popular", "Z-A"]

    if(req.user) {
        res.render("comics/comics", {pageName: "comics", genres: genres, status: status, type: type, order: order, user: req.user});
    } else {
        res.render("comics/comics", {pageName: "comics", genres: genres, status: status, type: type, order: order, user: null});
    }
}

const singlePageComicView = (req, res) => {

    const titlePath = req.params.titlePath;

    Comic.findOne({titlePath: titlePath}, (err, foundComic) => {
        if(err) {
            console.log(err);
        } else {
            if(foundComic) {
                console.log(foundComic);
                res.render("comics/comic", {pageName: "comics", comic: foundComic,  user: null});
            }
        }
    })
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

module.exports = {
    comicPageView,
    singlePageComicView,
    readComicView,
}