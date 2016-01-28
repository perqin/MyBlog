var db = null;

function init(dbObj) {
    db = dbObj;
}

function createPost(title, authorId, content, callback) {
    db.collection('posts').insertOne({
        title: title,
        author_id: authorId,
        content: content
    }).then(function (r) {
        callback(null, r.ops[0]._id);
    });
}

function readPost(postId, callback) {
    db.collection('posts').find({ _id: postId }).project({ _id: 1, title: 1, summary: 1, author: 1, content: 1 }).toArray().then(function (docs) {
        callback(docs);
    });
}

function readPosts(callback) {
    db.collection('posts').find().project({ _id: 1, title: 1, summary: 1, author: 1 }).toArray().then(function (docs) {
        callback(docs);
    });
}

function updatePost(postId, newData, callback) {
    var n = {};
    // TODO
    db.collection('posts').updateOne({ _id: postId }, { $set: n }).then(function (r) {
        callback(r.modifiedCount > 0)
    })
}

function deletePost(postId, callback) {
    db.collection('posts').deleteOne({ _id: postId }).toArray().then(function (r) {
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
