var routerMain = require('./router_main');
var routerApi = require('./router_api');

function addRouters(app) {
    app.use('/', routerMain);
    app.use('/users', routerApi);
}

module.exports = {
    addRouters: addRouters
};
