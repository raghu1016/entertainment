var express = require("express");
var router  = express.Router({mergeParams:true});
var Entertainment= require("../models/entertainment")
var Comment      = require("../models/comment")
var middleware = require("../middleware")



//============================================//
//comment routes//
//============================================//


// comment new
router.get("/new",middleware.isLoggedIn, function(req, res) {
    Entertainment.findById(req.params.id, function(err, foundentertainment) {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {
            entertainment : foundentertainment
            })
        }
    })
});

// comment create

router.post("/",middleware.isLoggedIn, function(req, res) {
    Entertainment.findById(req.params.id, function(err, entertainment) {
        if (err) {
            console.log(err)
            res.redirect("/entertainment")

        } else {
                 var message = req.body.message
                 var newMessage = {message: message}
                 // console.log(newMessage)
            Comment.create(newMessage, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong")
                    console.log(err)
                } else {
                    // console.log(req.user)
                    // add username and id comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username; 
                    // console.log(req.user)              
                    // console.log("new comment's userid" + comment.author.id)
                    // save comment
                    comment.save();
                  // console.log("created comment" + req.body.entertainment)
                    // console.log(req.body)
                    entertainment.comments.push(comment)
                    entertainment.save()
                    res.redirect('back');
                    // console.log(comment)
                    // console.log("entered comment" + req.body.entertainment)
                    // console.log("created comment id" + comment._id)
                    // console.log("created new comment is" + comment)
                    // req.flash("success", "comments successfully added")
                    // res.redirect("/entertainment/" + entertainment._id)
                }
            });
        }
    });
});

//edit comments route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, (req, res)=>{
   Comment.findById(req.params.comment_id,function (err,foundcomment){
    if(err){
        res.redirect("back")
    }
    else{
        res.render("comments/edit",{entertainment_id:req.params.id,comment:foundcomment})
    }
   })   
})

//update comment route
router.put("/:comment_id",middleware.checkCommentOwnership,function (req, res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err, updatedcomment){
        if(err){
            res.redirect("back")
        } else {
         res.redirect("/entertainment/" + req.params.id)   
        }
    })
})

// delet comment route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id,function (err){
     if(err) {
        console.log(err)
        res.redirect("back")
     } else{
        // console.log(req.params.comment_id)
        req.flash("success", "successfully comments deleted")
        res.redirect("/entertainment/" + req.params.id)
     }
   })

})

module.exports= router;