var ObjectID = require('mongodb').ObjectID;

var db = null;

function init(dbObj) {
    db = dbObj;
}

function createComment(cmtData, callback) {
    db.collection('comments').insertOne(cmtData).then(function (r) {
        callback(r.insertedCount > 0 ? r.ops[0]._id : null);
    });
}

function readComment(cid, callback) {
    var oid = new ObjectID.createFromHexString(cid);
    db.collection('comments').find({ _id: oid }).toArray().then(function (docs) {
        callback(docs.length > 0 ? docs[0] : null);
    });
}

function readComments(pid, callback) {
    db.collection('comments').find({ post_id: pid }).toArray().then(function (docs) {
        callback(docs.length > 0 ? docs : []);
    });
}

function updateComment(cid, newData, callback) {
    var oid = new ObjectID.createFromHexString(cid);
    db.collection('comments').updateOne({ _id: oid }, { $set: newData }).then(function (r) {
        callback(r.modifiedCount > 0);
    });
}

function deleteComment(cid, callback) {
    var oid = new ObjectID.createFromHexString(cid);
    db.collection('comments').deleteOne({ _id: oid }).then(function (r) {
        callback(r.deletedCount > 0);
    });
}

module.exports = {
    init: init,
    createComment: createComment,
    readComments: readComments,
    updateComment: updateComment,
    deleteComment: deleteComment
};
