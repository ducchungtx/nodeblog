var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', function (req, res, next) {  
  var posts = db.get('posts');
  posts.find({}, {}, function (err, posts) {
    res.render('index', {
      title: 'Home',
      errors: false,
      posts
    });
  })
});

module.exports = router;
