function findUserBy(key, value, callback) {
    callback(null, [{username: 'admin', password: 'admin'}]);
}

module.exports = {
    findUserBy: findUserBy
};