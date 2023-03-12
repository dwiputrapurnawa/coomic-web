const express = require("express");
const router = express.Router();
const {comicPageView, singlePageComicView, readComicView, addBookmark, submitRating, bookmarkView} = require("../controllers/comic_controller");


router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  });
  
router.get("/", comicPageView);
router.get("/bookmark", bookmarkView);
router.get("/:titlePath", singlePageComicView);
router.get("/:titlePath/:chapterPath", readComicView);
router.post("/add-bookmark", addBookmark);
router.post("/submit-rating", submitRating);


module.exports = router;