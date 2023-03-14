const passport = require("passport");
const Admin = require("../models/Admin");
const User = require("../models/User");
const {Comic} = require("../models/Comic");
const {Chapter} = require("../models/Chapter");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
const _ = require("lodash");
const fs = require("fs");

var thumbnailStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/thumbnails");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

let chapterStorage = multer.diskStorage({
    destination: function(req, file, cb) {

        const {chapter} = req.body;
        const {comicId} = req.params;

        const path = "./uploads/comics/" + comicId  + "/chapter-" + chapter;
        fs.mkdirSync(path, {recursive: true})
        return cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadThumbnail = multer({storage: thumbnailStorage}).single("thumbnail");
const uploadNone = multer().none();
const uploadChapter = multer({storage: chapterStorage}).array("pages")


const adminLoginView = (req, res) => {
    res.render("admin/login", {error: req.flash().error});
}

const adminLoginPost = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const admin = new Admin({
        email: email,
        password: password,
    });

    req.login(admin, err => {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("admin-login", {failureRedirect: "/admin/login", failureFlash: true})(req, res, () => {
                res.redirect("/admin/dashboard");
            });
        }
    });
}

const adminDashboardView = async (req, res)  => {

    try {

    const comicCount = await Comic.countDocuments({});
    const chapterCount = await Chapter.countDocuments({});
    const userCount = await User.countDocuments({});

    const chapters = await Chapter.find({}).sort({createdAt: -1});


    res.render("admin/dashboard", {pageName: "dashboard", comicCount: comicCount, chapterCount: chapterCount, userCount: userCount, chapters: chapters});

    } catch(err) {
        console.log(err);
    }
}

const adminComicsView = (req, res) => {

    Comic.find({}, (err, foundComics) => {
        if(err) {
            console.log(err);
        } else {
            if(foundComics) {
                res.render("admin/comics", {pageName: "comics", comics: foundComics});
            }
        }
    })
    
}

const adminUserManagementView = (req, res) => {

    User.find({}, (err, foundUsers) => {
        if(err) {
            console.log(err);
        } else {
            if(foundUsers) {
                res.render("admin/user_management", {pageName: "user_management", users: foundUsers});
            }
        }
    });

    
}

const adminManagementPost = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.log(err);
        } else {
            const newAdmin = new Admin({
                email: email,
                password: hash,
                role: role,
            });

            newAdmin.save((err) => {
                if(err) {
                    console.log(err);
                } else {
                    res.redirect("/admin/dashboard/admin-management");
                }
            })
        }
    })

}

const adminManagementView = (req, res) => {
    Admin.find({}, (err, foundAdmins) => {
        if(err) {
            console.log(err);
        } else {
            if(foundAdmins) {
                res.render("admin/admin_management", {pageName: "admin_management", admins: foundAdmins});
            }
        }
    })
}

const adminLogout = (req, res) => {
    req.logout((err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/admin/login");
        }
    });
}

const adminDelete = (req, res) => {
    const adminId = req.params.adminId;

    Admin.findByIdAndDelete(adminId, (err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/admin/dashboard/admin-management");
        }
    });
}

const adminEdit = (req, res) => {
    const adminId = req.body.adminId;
    const role = req.body.role;

    Admin.findByIdAndUpdate(adminId, {role: role}, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully updated admin with ID: " + adminId);
            res.redirect("/admin/dashboard/admin-management");
        }
    })
}

const adminAddUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: email,
            password: hash,
            role: "User"
        });

        newUser.save((err) => {
            if(err) {
                console.log(err);
            } else {
                console.log("Successfully created new user");
                res.redirect("/admin/dashboard/user-management");
            }
        });
    })
}

const adminDeleteUser = (req, res) => {
    const userId = req.params.userId;

    User.findByIdAndRemove(userId, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully deleted user with ID: ", userId);
            res.redirect("/admin/dashboard/user-management");
        }
    })
}

const adminAddComicView = (req, res) => {
    res.render("admin/add_comic", {pageName: "comics"});
}

const adminAddComic = (req, res) => {
    uploadThumbnail(req, res, (err) => {
        if(err) {
            console.log(err);
        } else {
            const title = req.body.title;
            const thumbnailPath = req.file.path;
            const author = req.body.author;
            const status = req.body.status;
            const type = req.body.type;
            const synopsis = req.body.synopsis;
            const genres = req.body.genres
            const genresArr = genres.split(",");

            const newComic = new Comic({
                title: title,
                titlePath: _.kebabCase(title),
                thumbnail: thumbnailPath,
                synopsis: synopsis,
                author: author,
                status: status,
                type: type,
                genres: genresArr,
            });

            console.log(newComic);

            newComic.save((err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully added new comic");
                    res.redirect("/admin/dashboard/comics")
                }
            })

            

        }
    })
}

const adminDeleteComic = (req, res) => {
    const comicId = req.params.comicId;

    Comic.findByIdAndDelete(comicId, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Successfully deleted with ID: ", comicId);
            res.redirect("/admin/dashboard/comics");
        }
    });
}

const adminEditComicView = (req, res) => {
    const comicId = req.params.comicId;

    Comic.findById(comicId, (err, foundComic) => {
        if(err) {
            console.log(err);
        } else {
            if(foundComic) {
                res.render("admin/edit_comic", {pageName: "comics", comic: foundComic});
            }
        }
    })
}

const adminEditComicPost = (req, res) => {

    uploadThumbnail(req, res, (err) => {
            if(err) {
                console.log(err);
            } else {
                if(req.file) {
                    const comicId = req.params.comicId;
                    const title = req.body.title;
                    const titlePath = _.kebabCase(title);
                    const thumbnail = req.file.path;
                    const synopsis = req.body.synopsis;
                    const author = req.body.author;
                    const genres = req.body.genres;
                    const genresArr = genres.split(",");
                    const status = req.body.status;
                    const type = req.body.type;

                    const updatedField = {
                        title: title,
                        titlePath: titlePath,
                        thumbnail: thumbnail,
                        synopsis: synopsis,
                        author: author,
                        genres: genresArr,
                        status: status,
                        type: type,
                    };
                    

                    Comic.findByIdAndUpdate(comicId, updatedField, (err) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("Successfully updated comic with ID: ", comicId);
                            res.redirect("/admin/dashboard/comics")
                        }
                    });
                } else {
                    const comicId = req.params.comicId;
                    const title = req.body.title;
                    const titlePath = _.kebabCase(title);
                    const synopsis = req.body.synopsis;
                    const author = req.body.author;
                    const genres = req.body.genres;
                    const genresArr = genres.split(",");
                    const status = req.body.status;
                    const type = req.body.type;

                    const updatedField = {
                        title: title,
                        titlePath: titlePath,
                        synopsis: synopsis,
                        author: author,
                        genres: genresArr,
                        status: status,
                        type: type,
                    };
                    

                    Comic.findByIdAndUpdate(comicId, updatedField, (err) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("Successfully updated comic with ID: ", comicId);
                            res.redirect("/admin/dashboard/comics")
                        }
                    });
                }

            }
    
        })

}

const adminAddChapter = (req, res) => {
    const comicId = req.params.comicId;
    
    
    uploadChapter(req, res, (err) => {
        if(err) {
            console.log(err);
        } else {

            Comic.findById(comicId, (err, foundComic) => {
                if(err) {
                    console.log(err);
                } else {
                    if(foundComic) {

                        const pages = req.files;
                        const chapter = req.body.chapter;
                        const pagesPath = [];

                        pages.forEach(page => {
                            pagesPath.push(page.path);
                        });

                        const newChapter = new Chapter({
                            comicTitle: foundComic.title,
                            number: chapter,
                            chapterPath: _.kebabCase(foundComic.title + "Chapter" + chapter),
                            pages: pagesPath,
                        })

                        newChapter.save((err) => {
                            if(err){
                                console.log(err);
                            } else {
                                foundComic.chapters.push(newChapter);
                                foundComic.save((err) => {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        res.redirect("/admin/dashboard/comics")
                                    }
                                });
                            }
                        })

                        

                    }
                }
            })

        }
    })


    

}

module.exports = {
    adminLoginView,
    adminLoginPost,
    adminDashboardView,
    adminComicsView,
    adminUserManagementView,
    adminManagementView,
    adminManagementPost,
    adminLogout,
    adminDelete,
    adminEdit,
    adminAddUser,
    adminDeleteUser,
    adminAddComicView,
    adminAddComic,
    adminDeleteComic,
    adminEditComicView,
    adminEditComicPost,
    adminAddChapter,
}