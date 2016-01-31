var modelUser = require('./model_user');
var ObjectID = require('mongodb').ObjectID;

var db = null;

function init(dbObj) {
    db = dbObj;
}

function createPost(title, authorId, content, callback) {
    db.collection('posts').insertOne({
        title: title,
        summary: content.substr(0, 60),
        author_id: authorId,
        content: content,
        blocked: false
    }).then(function (r) {
        callback(null, r.ops[0]._id);
    });
}

function readPost(postId, callback) {
    var oid = new ObjectID.createFromHexString(postId);
    db.collection('posts').find({ _id: oid }).project({ _id: 1, title: 1, summary: 1, author_id: 1, content: 1, blocked: 1 }).toArray().then(function (docs) {
        if (docs.length > 0) {
            modelUser.findUserBy('_id', docs[0].author_id, function (err, users) {
                docs[0].author = users.length > 0 ? users[0].nickname : '';
                callback(docs);
            });
        } else {
            callback(docs);
        }
    });
}

function readPosts(callback) {
    db.collection('posts').find().project({ _id: 1, title: 1, summary: 1, author_id: 1, blocked: 1 }).toArray().then(function (docs) {
        for (var i = 0; i < docs.length; ++i) {
            docs[i].author = '';
        }
        callback(docs);
    });
}

function updatePost(postId, newData, callback) {
    var oid = new ObjectID.createFromHexString(postId);
    if (newData.content) {
        newData.summary = newData.content.substr(0, 60);
    }
    db.collection('posts').updateOne({ _id: oid }, { $set: newData }).then(function (r) {
        callback(r.modifiedCount > 0)
    });
}

function deletePost(postId, callback) {
    var oid = new ObjectID.createFromHexString(postId);
    db.collection('posts').deleteOne({ _id: oid }).then(function (r) {
        callback(r.deletedCount > 0);
    });
}

module.exports = {
    init: init,
    createPost: createPost,
    readPost: readPost,
    readPosts: readPosts,
    updatePost: updatePost,
    deletePost: deletePost
};
