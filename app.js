require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const rootRoute = require("./routes/root");
const comicRoute = require("./routes/comic");
const adminRoute = require("./routes/admin");

const User = require("./models/User");
const Admin = require("./models/Admin");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        role: user.role,
      });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use("user-login", new LocalStrategy({usernameField: "email", passwordField: "password"}, (email, password, cb) => {
    User.findOne({email: email}, (err, foundUser) => {
        if(err) {
            console.log(err);
            return cb(err);
        } else {
            if(foundUser) {

                bcrypt.compare(password, foundUser.password, (err, result) => {
                    if(err) {
                        console.log(err);
                        return cb(err);
                    } else {
                        if(result) {
                            return cb(null, foundUser);
                        } else {
                            console.log("Incorrect email or password");
                            return cb(null, false, {message: "Incorrect email or password"});
                        }
                    }
                })

            } else {
                console.log("User not found");
                return cb(null, false, {message: "User not found"})
            }
        }
    })
}));

passport.use("admin-login", new LocalStrategy({usernameField: "email", passwordField: "password"}, (email, password, cb) => {
    Admin.findOne({email: email}, (err, foundUser) => {
        if(err) {
            console.log(err);
            return cb(err);
        } else {
            if(foundUser) {

                bcrypt.compare(password, foundUser.password, (err, result) => {
                    if(err) {
                        console.log(err);
                        return cb(err);
                    } else {
                        if(result) {
                            return cb(null, foundUser);
                        } else {
                            console.log("Incorrect email or password");
                            return cb(null, false, {message: "Incorrect email or password"});
                        }
                    }
                })

            } else {
                console.log("User not found");
                return cb(null, false, {message: "User not found"})
            }
        }
    })
}));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Database Connected");
    }
});



app.use("/", rootRoute);
app.use("/comics", comicRoute);
app.use("/admin", adminRoute);




app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT);
})