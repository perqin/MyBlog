var express = require('express');
var router = express.Router();
var modelUser = require('../models/model_user');
var modelPost = require('../models/model_post');
var modelComment = require('../models/model_comment');

router.post('/login', function(req, res, next) {
    var resJson = {
        error: {},
        data: {
            permission: 'guest'
        }
    };
    if (req.session.username) {
        modelUser.findUserBy('username', req.session.username, function (err, items) {
            if (err) {
                resJson.error.code = 1;
                resJson.error.message = 'Server error!';
            } else if (items.length == 0) {
                resJson.error.code = 1;
                resJson.error.message = 'User not found!';
                req.session.username = null;
                //req.clearCookie();
            } else {
                resJson.error.code = 0;
                resJson.error.message = 'Login succeed!';
                resJson.data.permission = items[0].username == 'admin' ? 'admin' : 'user';
                resJson.data.user_id = items[0]._id;
                resJson.data.username = items[0].username;
                resJson.data.nickname = items[0].nickname;
                req.session.username = items[0].username;
            }
            res.send(JSON.stringify(resJson));
        });
    } else {
        modelUser.findUserBy('username', req.body.username, function (err, items) {
            if (err) {
                resJson.error.code = 1;
                resJson.error.message = 'Server error!';
            } else if (items.length == 0) {
                resJson.error.code = 1;
                resJson.error.message = 'User not found!';
                req.session.username = null;
            } else if (items[0].password != req.body.password) {
                resJson.error.code = 1;
                resJson.error.message = 'Password incorrect!';
                req.session.username = null;
            } else {
                resJson.error.code = 0;
                resJson.error.message = 'Login succeed!';
                resJson.data.permission = items[0].username == 'admin' ? 'admin' : 'user';
                resJson.data.user_id = items[0]._id;
                resJson.data.username = items[0].username;
                resJson.data.nickname = items[0].nickname;
                req.session.username = items[0].username;
            }
            res.send(JSON.stringify(resJson));
        })
    }
});

router.post('/register', function (req, res, next) {
    var resJson = {
        error: {},
        data: {}
    };
    if (req.session.username) {
        resJson.error.code = 1;
        resJson.error.message = 'Already login! Please logout first!';
        res.send(JSON.stringify(resJson));
    } else {
        modelUser.createUser({
            username: req.body.username,
            nickname: req.body.nickname,
            password: req.body.password
        }, function (r) {
            resJson.error.code = r.errorCode;
            resJson.error.message = r.errorMsg;
            resJson.data = r.userInfo;
            if (resJson.error.code == 0) {
                req.session.username = resJson.data.username;
            }
            res.send(JSON.stringify(resJson));
        });
    }
});

router.post('/logout', function (req, res, next) {
    var resJson = {
        error: {},
        data: {}
    };
    req.session.username = null;
    //req.clearCookie();
    resJson.error.code = 0;
    resJson.error.data = 'Logout successfully!';
    res.send(JSON.stringify(resJson));
});

router.get('/posts', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: []
    };
    modelPost.readPosts(function (posts) {
        for (var i = 0; i < posts.length; ++i) {
            var p = {};
            p.post_id = posts[i]._id;
            p.title = posts[i].title;
            p.author = posts[i].author;
            p.author_id = posts[i].author_id;
            p.summary = posts[i].summary;
            p.blocked = posts[i].blocked;
            resJson.data.push(p);
        }
        res.send(JSON.stringify(resJson));
    });
});

router.get('/post/:pid', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {}
    };
    modelPost.readPost(req.params.pid, function (docs) {
        if (docs.length > 0) {
            resJson.data.post_id = docs[0]._id;
            resJson.data.title = docs[0].title;
            resJson.data.author = docs[0].author;
            resJson.data.author_id = docs[0].author_id;
            resJson.data.summary = docs[0].summary;
            resJson.data.content = docs[0].content;
            resJson.data.blocked = docs[0].blocked;
        } else {
            resJson.error.code = 1;
            resJson.error.message = 'Post not found!';
        }
        res.send(JSON.stringify(resJson));
    });
});

router.post('/post', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {}
    };
    modelPost.createPost(req.body.title, req.body.user_id, req.body.content, function (err, pid) {
        resJson.data.post_id = pid;
        res.send(JSON.stringify(resJson));
    });
});

router.put('/post/:pid', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {}
    }, u = {};
    if (req.body.title) {
        u.title = req.body.title;
    }
    if (req.body.content) {
        u.content = req.body.content;
    }
    if (req.body.blocked === true || req.body.blocked === false) {
        u.blocked = req.body.blocked;
    }
    modelPost.updatePost(req.params.pid, u, function (success) {
        resJson.error.code = success ? 0 : 1;
        resJson.error.message = success ? '' : 'Post not found!';
        res.send(JSON.stringify(resJson));
    });
});

router.delete('/post/:pid', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {}
    };
    modelPost.deletePost(req.params.pid, function (success) {
        resJson.error.code = success ? 0 : 1;
        resJson.error.message = success ? '' : 'Post not found!';
        res.send(JSON.stringify(resJson));
    });
});

router.get('/comments', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: []
    };
    modelComment.readComments(req.query.post_id, function (cmts) {
        for (var i = 0; i < cmts.length; ++i) {
            var p = {};
            p.comment_id = cmts[i]._id;
            p.author = cmts[i].author;
            p.author_id = cmts[i].author_id;
            p.post_id = cmts[i].post_id;
            p.content = cmts[i].content;
            p.blocked = cmts[i].blocked;
            resJson.data.push(p);
        }
        res.send(JSON.stringify(resJson));
    })
});

router.post('/comments', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {}
    };
    var cmt = {
        author_id: req.body.author_id,
        author: req.body.author,
        post_id: req.body.post_id,
        content: req.body.content,
        blocked: false
    };
    modelComment.createComment(cmt, function (cid) {
        resJson.data.comment_id = cid;
        res.send(JSON.stringify(resJson));
    });
});

router.put('/comments/:cid', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {}
    }, u = {};
    if (req.body.content) {
        u.content = req.body.content;
    }
    if (req.body.blocked === true || req.body.blocked === false) {
        u.blocked = req.body.blocked;
    }
    modelComment.updateComment(req.params.cid, u, function (success) {
        resJson.error.code = success ? 0 : 1;
        resJson.error.message = success ? '' : 'Comment not found!';
        res.send(JSON.stringify(resJson));
    });
});

router.delete('/comments/:cid', function (req, res, next) {
    var resJson = {
        error: {
            code: 0,
            message: ''
        },
        data: {}
    };
    modelComment.deleteComment(req.params.cid, function (success) {
        resJson.error.code = success ? 0 : 1;
        resJson.error.message = success ? '' : 'Comment not found!';
        res.send(JSON.stringify(resJson));
    });
});

module.exports = router;
