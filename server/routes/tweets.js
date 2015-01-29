var express = require('express');
var router = express.Router();
var Tweet = require('../models/tweet');
var nedb = require('nedb');
var datastore = new nedb();

/* GET users listing. */
router.get('/', function (req, res) {
    var tweets = datastore.getAllData().sort({ timestamp: -1 });
    res.status(200).json({ tweets: tweets });
});

router.post('/', function (req, res, next) {
    if (!req.body.tweet) {
        return next({ status: 400 });
    }

    var author = req.body.tweet.author;
    var message = req.body.tweet.message;

    if (!author || !message) {
        return next({ status: 400 });
    }

    var tweet = new Tweet(author, message);
    datastore.insert(tweet, function (err) {
        if (err) {
            return next({ status: 500, message: err });
        }

        res.status(201).json({ tweet: tweet });
    });
});

module.exports = router;