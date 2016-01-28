var validator = require('../public/javascripts/validator');

var db = null;

function uniqueCheck(info, keys, callback) {
    db.collection('users').find().toArray().then(function (docs) {
        var u = {
            isUnique: true,
            errorMsg: ''
        };
        for (var i = 0; i < docs.length; ++i) {
            for (var j = 0; j < keys.length; ++j) {
                if (docs[i].hasOwnProperty(keys[j]) && info.hasOwnProperty(keys[j]) && docs[i][keys[j]] === info[keys[j]]) {
                    u.errorMsg = keys[j] + ' has already existed!';
                    u.isUnique = false;
                }
            }
        }
        callback(u);
    })
}

function init(dbObj) {
    db = dbObj;
}

function createUser(info, callback) {
    var result = {
        userInfo: {}
    };
    var v = validator.validate(info, ['username', 'password', 'nickname']);
    uniqueCheck(info, ['username'], function (u) {
        result.errorCode = v.isValid && u.isUnique ? 0 : 1;
        result.errorMsg = !v.isValid ? v.errorMsg : (!u.isUnique ? u.errorMsg : '');
        if (result.errorCode == 0) {
            db.collection('users').insertOne(info).then(function (r) {
                result.userInfo.user_id = r.ops[0]._id;
                result.userInfo.username = r.ops[0].username;
                result.userInfo.nickname = r.ops[0].nickname;
                result.userInfo.permission = r.ops[0].username == 'admin' ? 'admin' : 'user';
                callback(result);
            });
        } else {
            callback(result);
        }
    });
}

function findUserBy(key, value, callback) {
    var f = {};
    f[key] = value;
    db.collection('users').find(f).toArray().then(function (docs) {
        callback(null, docs);
    });
}

module.exports = {
    init: init,
    createUser: createUser,
    findUserBy: findUserBy
};
