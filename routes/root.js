const express = require("express");
const router = express.Router();

const {homePageView, loginPageView} = require("../controllers/controller");

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  });

router.get("/", homePageView);
router.get("/login", loginPageView);



module.exports = router;