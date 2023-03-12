const express = require("express");
const router = express.Router();

const {homePageView, loginPageView, loginUserPost, registerPageView, registerUserPost, logout, comment} = require("../controllers/controller");

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  });

router.get("/", homePageView);
router.get("/login", loginPageView);
router.post("/login", loginUserPost);
router.get("/register", registerPageView);
router.post("/register", registerUserPost);
router.get("/logout", logout);
router.post("/comment", comment);



module.exports = router;