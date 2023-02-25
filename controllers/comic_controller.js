const comicPageView = (req, res) => {

    const genres = ["action","adventure","romance"];
    const status = ["ongoing", "completed", "hiatus", "dropped", "coming soon"];
    const type = ["manga", "manhwa", "manhua"];
    const order = ["A-Z", "popular", "Z-A"]

    if(req.user) {
        res.render("comics/comic", {pageName: "comics", genres: genres, status: status, type: type, order: order, user: req.user});
    } else {
        res.render("comics/comic", {pageName: "comics", genres: genres, status: status, type: type, order: order, user: null});
    }
}

module.exports = {
    comicPageView,
}