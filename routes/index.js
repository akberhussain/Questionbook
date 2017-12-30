var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Question = require("../models/question");
var Key = require("../models/key");
var middleware = require("../middleware/index");


//  ===========================================================

            // INDEX


router.get("/",function(req, res){

   Question.find({}).populate("key").exec(function(err, questions){
        if(err){
            console.log(err);
        } else{
            res.render("index", {questions: questions}); 
        }
   }) 
});


// Ask Question
router.get("/home/new", middleware.isLoggedIn, function(req, res) {
    res.render("new");
});

router.post("/askquestion", middleware.isLoggedIn, function(req, res){
    var question = req.body.question;
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    var obj = {question: question, author: author};
    
    Question.create(obj, function(err, question){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Your Question is successfully saved");
            res.redirect("/");
        }
    });
});

router.get("/addkeyto/:id", function(req, res){
    Question.findById(req.params.id, function(err, question){
        res.render("addkey", {question: question});
    });
});

router.post("/addkeyto/:id", function(req, res){
    var obj = {key: req.body.key};

    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
        } else{
            Key.create(obj, function(err, key){
                if(err){
                    console.log(err);
                } else{
                    question.key.push(key);
                    key.save();
                    question.save();
                    res.redirect("/");
                }
            })
        }
    });
});

            //  Finding Questions

// router.post("/results", function(req, res) {
//     var search = req.body.search;

//     User.find({name : name},function(err, foundResult){
//         if(err){
//             console.log("Error");
//         }
//         else{
//                     // Ref = 1 for campgrounds.ejs
//             // res.render("places/places", {places:foundResult, url : "/restaurants", name : "Results"});
//             res.render("places/users", {users: foundResult, url: "/user", name: "Users"});                      
//         }
//     });
    
// });
            //  Showing found Questions

// router.get("/user/:id", function(req, res){
//     User.findById(req.params.id, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else{
//             res.render("places/foundUser", {foundUser: foundUser});
//         }
//     });
// });

// =========================
//  Authentication Routes
// =========================

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handle signup logic
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username, name : req.body.name, num: req.body.num, address: req.body.add}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.messge);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Questionbook " + req.body.name);    
            res.redirect("/");
        });
    });
});

// Show login form
router.get("/login", function(req, res) {
       res.render("login"); 
});

// Handle login logic
router.post("/login",passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res) {
    
});

// logout User
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Sucessfully logged you out !!!");
    res.redirect("/");
    
});


module.exports = router;