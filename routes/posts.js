var express = require('express');
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var db = require('monk')('localhost/nodeblog');

var router = express.Router();

/* GET posts */
router.get('/show/:id', function (req, res, next) {
  var posts = db.get('posts');

  posts.find({_id: req.params.id}, {}, function(err, post){
    console.log(post);
    res.render('show', {
      title: 'Single Content',
      errors: false,
      post: post[0]
    });
  })  
});

/* GET posts */
router.get('/add', function (req, res, next) {
  var categories = db.get('categories');

  categories.find({}, {}, function(err, categories){
    res.render('addpost', {
      title: 'Add Post',
      errors: false,
      categories
    });
  })  
});

router.post('/add', upload.single('mainimage'), function (req, res, next) {
  // get form value
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  
  if(req.file) {
    var mainimage = req.file.filename;
  } else {
    var mainimage = 'noimage.jpg';
  }

  // Form validator
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('body', 'Body field is required').notEmpty();

  // Check errors
  var errors = req.validationErrors();  
  if (errors) {
    res.render('addpost', {
      errors
    });
  } else {
    var posts = db.get('posts');
    posts.insert({
      title,
      body,
      category,
      date,
      author,
      mainimage
    }, function(err, post){
      if(err) {
        res.send(err);
      } else {
        req.flash('success', 'Post added');
        res.location('/');
        res.redirect('/');
      }
    })
  }

});

module.exports = router;
