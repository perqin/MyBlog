var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoClient = require('mongodb').MongoClient;
var dbUri = 'mongodb://localhost:27017/my_blog';

var routers = require('./controllers/routers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoClient.connect(dbUri, function (err, db) {
    if (err) {
        console.error('MongoClient connect error : ' + err);
    }

    // Init models
    require('./models/model_user').init(db);
    require('./models/model_post').init(db);
    require('./models/model_comment').init(db);

    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(session({
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        },
        resave: true,
        saveUninitialized: false,
        secret: 'MyBlog',
        store: new FileStore({
            ttl: 7 * 24 * 60 * 60
        })
    }));
    app.use(express.static(path.join(__dirname, 'public')));

    routers.addRouters(app);

// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
});


module.exports = app;
