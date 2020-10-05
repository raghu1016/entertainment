// var mongoose = require("mongoose");
// var Entertainment = require("./models/entertainment");
// var Comment   = require("/comment");

// var data = [
//     {name: "justin beiber", 
//     image: "https://static.toiimg.com/thumb/msid-70908917,imgsize-179486,width-800,height-600,resizemode-75/70908917.jpg",
//     description: "i knew him from since never give up song "},
//     {name: "taylar shift", 
//     image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSzjMvm2o9Lt0Fe6BMZH0yjL_GrqlzToZtNNCOK9CFVSerKKBki",
//     description: "i love every song of her"},
//     {name: "Kate Winslet",
//     image: "https://m.media-amazon.com/images/M/MV5BODgzMzM2NTE0Ml5BMl5BanBnXkFtZTcwMTcyMTkyOQ@@._V1_.jpg",
//     description: "i like her in titanic"}
//     ]

// function seedDB(){
//    //Remove all campgrounds
//    Entertainment.remove({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("removed entertainments!");
//         Comment.remove({}, function(err) {
//             if(err){
//                 console.log(err);
//             }
//             console.log("removed comments!");
//              //add a few campgrounds
//             data.forEach(function(seed){
//                 Entertainment.create(seed, function(err, entertainment){
//                     if(err){
//                         console.log(err)
//                     } else {
//                         console.log("added a entertainment");
//                         //create a comment
//                         Comment.create(
//                             {
//                                 text: "This place is great, but I wish there was internet",
//                                 author: "Homer"
//                             }, function(err, comment){
//                                 if(err){
//                                     console.log(err);
//                                 } else {
//                                     entertainment.comments.push(comment);
//                                     entertainment.save();
//                                     console.log("Created new comment");
//                                 }
//                             });
//                     }
//                 });
//             });
//         });
//     }); 
//     //add a few comments
// }

// module.exports = seedDB;