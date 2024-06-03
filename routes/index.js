const express = require('express');
const router = express.Router();
const userModel = require("./users")

const passport = require("passport")
const localStrategy = require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res) {
  res.render('regi');
});
 
router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile');
});

router.post("/register", function (req, res) {
  const { username, email, password, confirm } = req.body;
  const userdata = new userModel({ username, email, password, confirm });

  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
      })
    })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function (req, res) { });

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/regi");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/regi");
};
module.exports = router;