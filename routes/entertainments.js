var express = require("express");
var router  = express.Router();
var Entertainment= require("../models/entertainment")
var User = require("../models/user");
var Notification = require("../models/notification");
var middleware = require("../middleware")
var multer = require('multer');
var path = require("path");
// var upload = multer({dest: "./public/uploads/"})
var Storage = multer.diskStorage({
	destination: "./public/uploads/",
	filename: (req, file, cb)=>{
		cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	}
});

var fileFilter = function(req, file, cb) {
			var ext = path.extname(file.originalname)
			if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
				return cb(res.end('Only images are allowed'), null)
			}
			cb(null, true)
		}
var upload = multer({
	storage: Storage,
	filefilter: fileFilter
}).single("image");


//============================================//
//entertainment//
//============================================//


//index route
router.get("/",(req,res)=>{
	// console.log(req.user)
	var noMatch=null;
// console.log(req.query.search)
	if(req.query.search){
			// console.log(req.query.search)

	const regex = new RegExp(escapeRegex(req.query.search), 'gi');
	Entertainment.find({name:regex},function(err,allentertainments){
		// console.log(regex)
		if(err){
			console.log(err);
		       } 
		else{
			if(allentertainments.length<1){
				noMatch="no entertainment found for this search"
			}
		    res.render("entertainment/index",{entertainment:allentertainments,noMatch:noMatch})
		// console.log(allentertainments)
		// console.log(allentertainments.name)
              }
                                                                  })
}else{
	Entertainment.find({},function(err,allentertainments){
		if(err){
			console.log(err)
		} else{
			res.render("entertainment/index",{entertainment:allentertainments,noMatch:noMatch})
		}
	})
}
})

// created route	
router.post("/", middleware.isLoggedIn,upload, async function(req, res){
    // get data from form and add to campgrounds array
	var name= req.body.name
	var price= req.body.price
	var desc=req.body.description
	var author = {
		id: req.user._id,
		firstname: req.user.firstname,
		lastname:req.user.lastname,
		username:req.user.username
	}

    if(req.file){
  	var image = req.file.filename
  } else {
  	var image = 'noimage.jpg';
  }

    var newEntertainment = {name: name,price:price,image:image,description:desc,author:author}

    try {
      let entertainment = await Entertainment.create(newEntertainment);
      let user = await User.findById(req.user._id).populate('followers').exec();
      let newNotification = {
        username: req.user.username,
        entertainmentId: entertainment.id
      }
      for(const follower of user.followers) {
        let notification = await Notification.create(newNotification);
        follower.notifications.push(notification);
        follower.save();
      }
       	// console.log(req.user.firstname)
 	// console.log(req.body.name)
    // console.log(req.body.description)
 	// console.log(req.body.image
    // console.log(req.file.filename)
    // console.log("body" + req.body)
 	// console.log("entered e" + newEntertainment)
 	// console.log("created e" + newlycreated)
      //redirect back to campgrounds page
      // res.redirect(`/entertainment/${entertainment.id}`);
      res.redirect("/entertainment")
    } catch(err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
});



//create route
router.get("/new",middleware.isLoggedIn,(req, res)=>{
	res.render("entertainment/new")
})

//modify route
router.get("/:id",middleware.isLoggedIn,(req,res)=>{
	Entertainment.findById(req.params.id).populate("comments").exec(function(err,foundentertainment){
		if(err){
			console.log(err)
		       }
		else{
		// console.log(foundentertainment)
		res.render("entertainment/show",{entertainment:foundentertainment})	
		    }       
	})
	
})
//edit route
router.get("/:id/edit",middleware.checkEntertainmentOwnership,(req,res)=>{
 Entertainment.findById(req.params.id,function(err,foundentertainment){
 res.render("entertainment/edit",{entertainment:foundentertainment})
	
    //otther also redirect
	//if not,redirect
  })
})

//update entertainment route
router.put("/:id",middleware.checkEntertainmentOwnership,(req,res)=>{
Entertainment.findByIdAndUpdate(req.params.id,req.body,function(err, updatedentertainment){
	if(err){
			console.log(err)
			res.redirect("/entertainment")
		     }
		else{
	    req.flash("success", "successfully updated an entertainment info")
		res.redirect("/entertainment/"+ req.params.id)
		// console.log(updatedentertainment)
		// console.log("id"+req.params.id)
		// console.log("body"+req.body)	
		    } 
})

})
// DELETE entertainment ROUTE
router.delete("/:id",middleware.checkEntertainmentOwnership,(req,res)=>{
	Entertainment.findByIdAndRemove(req.params.id,function(err, deletedentertainment){
	if(err){
			console.log(err)
			res.redirect("/entertainment")
		     }
		else{
	    req.flash("error", "successfully deleted an entertainment")
		res.redirect("/entertainment")
		// console.log(deletedentertainment)	
		    } 

    })
})

//fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;