const passport = require("passport");
const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const adminLoginView = (req, res) => {
    res.render("admin/login");
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
            passport.authenticate("admin-login", {failureRedirect: "/admin/login"})(req, res, () => {
                res.redirect("/admin/dashboard");
            });
        }
    });
}

const adminDashboardView = (req, res) => {
    res.render("admin/dashboard", {pageName: "dashboard"});
}

const adminComicsView = (req, res) => {
    res.render("admin/comics", {pageName: "comics"});
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
}