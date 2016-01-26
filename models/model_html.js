var commons = {
    js: {
        //angularJs: 'http://cdn.bootcss.com/angular.js/1.5.0-rc.1/angular.min.js',
        angularJs: 'http://cdn.bootcss.com/angular.js/1.5.0-rc.1/angular.js',
        //angularRoute: 'http://cdn.bootcss.com/angular.js/1.5.0-rc.1/angular-route.min.js',
        angularRoute: 'http://cdn.bootcss.com/angular.js/1.5.0-rc.1/angular-route.js',
        angularApp: '/javascripts/app.js'
    },
    css: {
        baseCss: '/stylesheets/base.css',
        themeCss: '/stylesheets/theme.css'
    },
    app_name: 'MyBlog'
},model = {
    index_html: {
        angularJsSrc: commons.js.angularJs,
        angularRouteSrc: commons.js.angularRoute,
        pageTitle: 'INDEX',
        baseCssSrc: commons.css.baseCss,
        themeCssSrc: commons.css.themeCss,
        appName: commons.app_name,
        angularAppSrc: commons.js.angularApp
    }
};

function getModel(m) {
    return model.hasOwnProperty(m) ? model[m] : {};
}

module.exports = {
    getModel: getModel
};
