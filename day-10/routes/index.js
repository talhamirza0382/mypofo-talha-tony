var express = require("express");
var router = express.Router();
const { check, validationResult } = require('express-validator');
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;

var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get("/", function(req, res, next) {
  // Retreiving details for Recent Posts from Mongo DB
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("project1");
    dbo
      .collection("projects")
      .find({})
      .limit(3)
      .toArray(function(err, projects) {
        if (err) throw err;
        console.log("Projects = " + JSON.stringify(projects));
        dbo
          .collection("blogs")
          .find({})
          .limit(3)
          .toArray(function(err, blogs) {
            if (err) throw err;
            console.log("Blog = " + JSON.stringify(blogs));
            db.close();
            res.render("home", { blogs: blogs, projects: projects });
          });
      });
  });
});

/* GET Projects Page. */
router.get("/projects", function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("project1");
    dbo.collection("projects").find({}).toArray(function(err, projects) {
        if (err) throw err;
        console.log("Projects = " + JSON.stringify(projects));
        db.close();
        res.render("index", { projects: projects });
      });
  });
});
/* Get Project Details */
router.get("/projects/:id", function(req, res) {
  let id = req.params.id;
  console.log("id --- > ", id);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('projects').findOne({ _id: new ObjectId(id) }, function (err, projects) {
      if (err) throw err;
      db.close();
      res.render('project-detail', { projects: projects })
    })
  });
})

/* GET Blog Page. */
router.get("/blog", function(req, res, next) {
  // Get data from MongoDB
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("project1");
    dbo.collection("blogs").find({}).toArray(function(err, blogs) {
        if (err) throw err;
        console.log("Blog = " + JSON.stringify(blogs));
        db.close();
        res.render("blog", {title: "Blog",layout: "layout2",blogs: blogs});
      });
  });
});

/* blog details */

router.get("/blogs/:id", function(req, res) {
  let id = req.params.id;
  console.log("id --- > ", id);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("project1");
    dbo.collection('blogs').findOne({ _id: new ObjectId(id) }, function (err, blogs) {
      if (err) throw err;
      db.close();
      res.render('blog-details', { blogs: blogs })
    })
  });
})




/* GET Contact Page. */
router.get("/contact", function(req, res, next) {
  res.render("contact", {
    title: "Contact Us",
    layout: "layout2"
  });
});


router.post('/contact', [
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('mobile').isLength({ min: 10 }).withMessage('Mobile  number must be atleast 10 characters')
],


  function (req, res) {
    const z = validationResult(req);
    console.log(z)
    if (!z.isEmpty()) {
      var messages = [];
      z.errors.forEach(function (err) {


        console.log(messages)
        messages.push(err.msg)
        console.log('err.msg' + err.msg)

        console.log('messages' + messages)
      })



      res.render('contact', { errors: true, messages: messages });
    } else {  // tis is for success scenerio
      let name = req.body.name;
      let email = req.body.email;
      let mobile = req.body.mobile;
      let description = req.body.description;

      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('project1')   //to connect to project1
        let contact = { name, email, mobile }
        dbo.collection('persons').insertOne(contact, function (err, contactObj) {
          if (err) throw err;
          console.log(contact)
          console.log(" 1 document inserted" + contactObj._id);
          db.close();
          res.render('contact', { success: true });


        });
      })

    }
  })

/* GET About Page. */
router.get("/about", function(req, res, next) {
  res.render("about", {
    layout: "layout2"
  });
});

module.exports = router;
