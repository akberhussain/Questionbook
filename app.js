var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var User = require("./models/user");

// requiring routes
var indexRoutes = require("./routes/index");

var promise = mongoose.connect('mongodb://akber:123abc@ds153352.mlab.com:53352/restfulblogsite', {
  useMongoClient: true,
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "this is yelp_camp app",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// var c;
// Request.count({}, function(err, count){
//         if(err){
//             console.log(err);
//         }else{
//             c = count;
//         }        
// });

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
//    res.locals.count = c;
    next();
});

app.use(indexRoutes);

	app.listen(process.env.PORT || 3000, function(){
    console.log("Questionbook app has started on port: 3000 !!");
});