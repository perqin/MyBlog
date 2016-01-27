var express = require('express');
var router = express.Router();
var modelUser = require('../models/model_user');
var modelPost = require('../models/model_post');

router.post('/login', function(req, res, next) {
    var resJson = {
        error: {},
        data: {
            permission: 'guest'
        }
    };
    if (req.session.username) {
        resJson.error.code = 1;
        resJson.error.message = 'Already login!';
        res.send(JSON.stringify(resJson));
    } else {
        modelUser.findUserBy('username', req.body.username, function (err, items) {
            if (err) {
                resJson.error.code = 1;
                resJson.error.message = 'Server error!';
            } else if (items.length == 0) {
                resJson.error.code = 1;
                resJson.error.message = 'User not found!';
            } else if (items[0].password != req.body.password) {
                resJson.error.code = 1;
                resJson.erroe.message = 'Password incorrect!';
            } else {
                resJson.error.code = 0;
                resJson.error.message = 'Login succeed!';
                resJson.data.permission = req.body.username == 'admin' ? 'admin' : 'user';
                req.session.username = req.body.username;
            }
            res.send(JSON.stringify(resJson));
        })
    }
});

router.post('/logout', function (req, res, next) {
    var resJson = {
        error: {},
        data: {}
    };
    req.session.username = null;
    req.clearCookie();
    resJson.error.code = 0;
    resJson.error.data = 'Logout successfully!';
    res.send(JSON.stringify(resJson));
});

router.get('/posts', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        }
    };
    modelPost.readPosts(function (posts) {
        resJson.data = posts;
        res.send(JSON.stringify(resJson));
    });
});

router.get('/post/:pid', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {
            id: 0,
            title: 'PHP is the best language!',
            author: {
                username: 'admin',
                nickname: 'Admin'
            },
            summary: 'Yes PHP is the best language in the world! Yes PHP is the be...'
        }

    };
    res.send(JSON.stringify(resJson));
});

router.post('/post', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {}
    };
    // TODO : author_id
    modelPost.createPost(req.body.title, 0, req.body.content, function (err, pid) {
        resJson.data.post_id = pid;
        res.send(JSON.stringify(resJson));
    })
});

module.exports = router;
