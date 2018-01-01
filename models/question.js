var mongoose = require("mongoose");

var keySchema = new mongoose.Schema({
    text: String,
    count: {
        type: Number,
        default: 0
    }
});



var Key =  mongoose.model("Key", keySchema);


var questionSchema = new mongoose.Schema({
    question: String,
    key: [keySchema],
    author:{
        authorid:{
          type: mongoose.Schema.Types.ObjectId,
          ref : "User"
        },
        username: String
    }

});


var Question = mongoose.model("Question", questionSchema);
module.exports = {
    Question : Question,
    Key: Key
} 