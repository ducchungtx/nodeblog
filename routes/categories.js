var express = require('express');
var db = require('monk')('localhost/nodeblog');

var router = express.Router();

/* GET posts */
router.get('/add', function (req, res, next) {
    
    res.render('addcategory', {
        title: 'Add Category',
        errors: false
    });
    
});

router.post('/add', function (req, res, next) {
    // get form value
    var name = req.body.name;   

    // Form validator
    req.checkBody('name', 'Name field is required').notEmpty();    

    // Check errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('addcategory', {
            errors,
            title: 'Add Category'
        });
    } else {
        var categories = db.get('categories');
        categories.insert({
            name            
        }, function (err, post) {
            if (err) {
                res.send(err);
            } else {
                req.flash('success', 'Category added');
                res.location('/');
                res.redirect('/');
            }
        })
    }

});

module.exports = router;
