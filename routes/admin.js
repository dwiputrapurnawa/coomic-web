const express = require("express");
const router = express.Router();
const {adminDashboardView, adminComicsView, adminUserManagementView, adminAddUser, adminDeleteUser, adminAddComicView, adminAddComic, adminDeleteComic, adminEditComicView, adminEditComicPost, adminAddChapter} = require("../controllers/admin_controller");

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  });

router.get("/dashboard", adminDashboardView);
router.get("/dashboard/comics", adminComicsView);
router.get("/dashboard/user-management", adminUserManagementView);
router.post("/dashboard/user-management", adminAddUser);
router.get("/dashboard/user-management/delete/:userId", adminDeleteUser);
router.get("/dashboard/comics/add-comic", adminAddComicView);
router.post("/dashboard/comics/add-comic", adminAddComic);
router.get("/dashboard/comics/delete/:comicId", adminDeleteComic);
router.get("/dashboard/comics/edit-comic/:comicId", adminEditComicView);
router.post("/dashboard/comics/edit-comic/:comicId", adminEditComicPost);
router.post("/dashboard/comics/add-chapter/:comicId", adminAddChapter);

module.exports = router;