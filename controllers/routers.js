var routerMain = require('./router_main');
var routerApi = require('./router_api');

function addRouters(app) {
    app.use('/', routerMain);
    app.use('/api', routerApi);
}

module.exports = {
    addRouters: addRouters
};
