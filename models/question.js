var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var questionSchema = new mongoose.Schema({
    question: String,
    key: [
	        {
	            type: mongoose.Schema.Types.ObjectId,
	            ref : "Key"
	        }
    ],
    author:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref : "User"
        },
        username: String
    }

});

questionSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Question", questionSchema);