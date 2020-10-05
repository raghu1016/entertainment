var express         =require("express"),
    app             =express(),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    moment          = require("moment")
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Entertainment   = require("./models/entertainment"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    http            = require("http").createServer(app),
    io              = require("socket.io")(http),
    seedDB          = require("./seeds")

require('dotenv').config();

 // requiring route
 var commentRoutes          =  require("./routes/comments"), 
     entertainmentRoutes    =  require("./routes/entertainments"),
     indexRoutes            =  require("./routes/index")
// seedDB();

app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"dhanraj developing website",
	resave: false,
	saveUninitialized: false
}))

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.set("view engine","ejs");

var db = process.env.mongoURI;
mongoose.connect(db, { useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify:false})
mongoose.set('useCreateIndex', true);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//in app notifications
app.use(async function(req, res, next){
   res.locals.currentUser = req.user;
   if(req.user) {
    try {
      let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
      res.locals.notifications = user.notifications.reverse();
    } catch(err) {
      console.log(err.message);
    }
   }
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//currentUser information loged in or not
// app.use(function (req, res,next){
// 	res.locals.currentUser = req.user;
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");  
//     next();
// });

// passport.use(User.createStrategy());

// app.use(indexRoutes);
// app.use(entertainmentRoutes);
// app.use(commentRoutes);

app.use("/",indexRoutes);
app.use("/entertainment",entertainmentRoutes);
app.use("/entertainment/:id/comments",commentRoutes);


// socket connection and web sockets b/w server and client
io.on('connection',socket=>{
     socket.on("new_comment", comment=>{
    io.emit("new_comment", comment);
  })
     socket.on("blogSent",message=>{
       socket.broadcast.emit("blogSent", message);
     });
     
     socket.on("messageSent",message=>{
       socket.broadcast.emit("messageSent", message);
     });

  })


http.listen(process.env.PORT || 3000, ()=>{
	console.log("web app server has started");
})

