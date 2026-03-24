const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// Render Signup Form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Handle Signup Logic
router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        // 1. Register the user using await 
        // (Passport-Local-Mongoose supports this in modern versions)
        const registeredUser = await User.register(newUser, password);

        // 2. Wrap req.login in a Promise to ensure the code waits for it
        await new Promise((resolve, reject) => {
            req.login(registeredUser, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // 3. Flash success message and redirect
        req.flash("success", "Welcome to Atithi!");
        res.redirect("/login");

    } catch (e) {
        // If registration fails (e.g., user already exists), flash the error
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// Render Login Form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Handle Login Logic
router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome back to Atithi!");
        res.redirect("/listings");
    }
);
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
    })
})

module.exports = router;