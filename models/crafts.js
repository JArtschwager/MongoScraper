var mongoose = require("mongoose");
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// create new schema object
var craftSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id. 
  note: {
    type: Schema.Types.ObjectId,
    ref: "note"
  }
});

//  mongoose's model method
var Crafts = mongoose.model("crafts", craftSchema);

// Export the model
module.exports = Crafts;


