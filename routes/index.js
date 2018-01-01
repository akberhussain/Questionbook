var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Question = require("../models/question").Question;
var Key = require("../models/question").Key;
var middleware = require("../middleware/index");


//  ===========================================================

            // INDEX


router.get("/",function(req, res){

   Question.find({}, function(err, questions){
        // Key.find({}, function(err, keys){
        //     if(err){
        //         console.log(err);
        //         res.redirect("back");
        //     } else{
        //         res.render("index", {keys: keys, questions: questions});    
        //     }
        // });
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
                res.render("index", {questions: questions});    
            }
   });

});

router.get("/showdetails:id", function(req, res){
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
        } else{
            Key.find({}, function(err, keys){
                if(err){
                    console.log(err);
                } else{
                    // console.log(quest)
                   
                    res.render("show", {question: question, keys: keys});
                }
            });
        }
    });
});

//=========================== Ask Question ============================
router.get("/home/new", middleware.isLoggedIn, function(req, res) {
    res.render("new");
});

router.post("/askquestion", middleware.isLoggedIn, function(req, res){
    var question = req.body.question;
    var author = {
        authorid: req.user.id,
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

// ==========================================================================


//  ======================= ADD KEY =========================================

router.get("/addkeyto/:id", middleware.isLoggedIn , function(req, res){
    Question.findById(req.params.id, function(err, question){
        res.render("addkey", {question: question});
    });
});


router.post("/addkeyto/:id", middleware.isLoggedIn , function(req, res){
    var obj = {text: req.body.key};

    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            if(req.body.key===''){
                req.flash("error", "key can not be empty !!!")
                res.redirect("back");                
            } else{
             Key.create(obj, function(err, key){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else{
                    question.key.push(key);
                    key.save();
                    question.save();
                    req.flash("success", "Your key is added and available for people to vote !!");
                    res.redirect("/showdetails"+req.params.id);
                }
            })
            }
           
        }
    });
});

// ========================/ADD KEY===================================


router.post("/anything:id",middleware.isLoggedIn, function(req, res){
    
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{

            var value = req.body.selected;
            console.log(value);
            if(value==undefined){
                res.redirect('back');
            } else{
                question.key.forEach(function(key){
                    if(key.text===value){
                        key.count+=1;
                        key.save();
                        question.save();
                    }
                })
                Key.findOne({text: value}, function(err, key){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    } else{
                        key.count+=1;
                        key.save();                    
                    }
                })
                req.flash("success", "Thanks for Your Vote We have added your review ");
                res.redirect("/");
            }



        }
    })
});

// ==================DELETE QUESTION================================

router.delete("/removequestion:id", function(req, res){
    Question.findByIdAndRemove(req.params.id, function(err, question){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            req.flash("success", "Sucessfully deleted a question ");
            res.redirect("back");
        }
    }); 
})




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