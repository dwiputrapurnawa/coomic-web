const express = require("express");
const router = express.Router();
const {comicPageView, singlePageComicView, readComicView} = require("../controllers/comic_controller");


router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  });
  
router.get("/", comicPageView);
router.get("/:titlePath", singlePageComicView);
router.get("/:titlePath/:chapterPath", readComicView);

module.exports = router;