var Entertainment = require("../models/entertainment")
var Comment= require("../models/comment")
var User = require("../models/user")
// all middle goes here
var middlewareObj={};

middlewareObj.checkEntertainmentOwnership= function(req,res,next) {
	        //is user looged in?
			if(req.isAuthenticated() && req.user.active===true){
            Entertainment.findById(req.params.id,function(err,foundentertainment){
            if(err){
			// console.log(err)
			// res.redirect("/entertainment")
            req.flash("error", "Entertainment not find")
			res.redirect("back")
		           }
		    else   {	
		     // does user own entertainent
		    // console.log(foundentertainment.author.id)
		    // console.log(req.user._id)
                     if(foundentertainment.author.id.equals(req.user._id) || req.user.username === "raghu1016") {
		             // console.log(foundentertainment)	
		             next()	
                                                                           }
                     else{
                     // res.send("you do not have  permission to do that")
                     req.flash("error", "you aren't own this to do ")
                     res.redirect("back")    
                         }
		           }       
                                                                                  })
                                 }
            else{
		        // console.log("you need to be isLoggedIn")
		        // res.send("you need to be isLoggedIn")
                req.flash("error", "log in to entertainment")
		        res.redirect("back")
	            }
}

middlewareObj.checkCommentOwnership= function(req,res,next) {
            //is user looged in?
            if(req.isAuthenticated() && req.user.active===true){
           Comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err){
            // console.log(err)
            // res.redirect("/entertainment")
            res.redirect("back")
                   }
            else   {    
             // does user own entertainent
            // console.log(foundentertainment.author.id)
            // console.log(req.user._id)
                     if(foundcomment.author.id.equals(req.user._id) || req.user.username === "raghu1016") {
                     // console.log(foundentertainment) 
                     next() 
                                                                           }
                     else{
                     // res.send("you do not have  permission to do that")
                     req.flash("error", "you aren't own this to do")
                     res.redirect("back")    
                         }
                   }       
                                                                                  })
                                 }
            else{
                // console.log("you need to be isLoggedIn")
                // res.send("you need to be isLoggedIn")
                req.flash("error", "log in to entertainment")
                res.redirect("back")
                }
}
// middleware
middlewareObj.isLoggedIn =
function (req, res, next) {
    if (req.isAuthenticated() && req.user.active===true) {
        return next();
    }
    req.flash("error", "log in to entertainment or please verify your email account")
    res.redirect("/login");
}

module.exports= middlewareObj