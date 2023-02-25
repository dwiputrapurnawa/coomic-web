const express = require("express");
const router = express.Router();
const {comicPageView} = require("../controllers/comic_controller");


router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  });
  
router.get("/", comicPageView);

module.exports = router;