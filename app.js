var bodyParser     = require("body-parser");
var methodOverride = require("method-override");
var mongoose       = require("mongoose");
var express        = require("express");
var app            = express();


// APP CONFIG
mongoose.connect("mongodb://localhost/blogapp");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


// Mongoose-Model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTful Routes
app.get("/", function(req, res){
  res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("An Error Occured!");
    }else{
      res.render("index", {blogs: blogs});
    }
  });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
  res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
  // create the blog
  Blog.create(req.body.Blog, function(err, newBlog){
    if(err){
      res.render("new");
    }else{
      // redirect
      res.redirect("/blogs")
    }
  });
});

// SHOW PAGE
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("show", {blog: foundBlog});
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("edit", {blog: foundBlog})
    }
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.Blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/" + req.params.id);
    }
  })
});


app.listen(3000, function(req, res){
  console.log("Server is up...");
});
