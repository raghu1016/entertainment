var mongoose=require("mongoose")
    Comment =require("./comment")
    entertainmentSchema = new mongoose.Schema({
	name: String,
  price : String,
	image: String,
	description: String,
  createdAt: {type: Date,default: Date.now},
  author : {   
            id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User"
                },
            firstname:String,
            lastname :String,
            username: String

            },
  comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
            ]
});
module.exports = mongoose.model("Entertainment",entertainmentSchema);