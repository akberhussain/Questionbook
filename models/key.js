var mongoose = require("mongoose");
    
var keySchema = new mongoose.Schema({
    text: String,
});



module.exports =  mongoose.model("Key", keySchema);