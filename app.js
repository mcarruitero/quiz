var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.use(cookieParser('Quiz 2015'));
app.use(session());    
/*app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));
*/
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use(function (req, res, next) {
    var tiempo = 120000;
    req.session.cookie.expires = new Date(Date.now() + tiempo);
    //req.session.cookie.maxAge = tiempo;
    next();
});
*/
app.use(function(req, res, next) {
    if(req.session.user){// si estamos en una sesion
        if(!req.session.marcatiempo){//primera vez se pone la marca de tiempo
            req.session.marcatiempo=(new Date()).getTime();
        }else{
            if((new Date()).getTime()-req.session.marcatiempo > 120000){//se pasó el tiempo y eliminamos la sesión (2min=120000ms)
                delete req.session.user;  
                req.session.marcatiempo=null;
                   //eliminamos el usuario
            }else{//hay actividad se pone nueva marca de tiempo
                req.session.marcatiempo=(new Date()).getTime();
            }
        }
    }
    next();
});


app.use(function(req, res, next) {
    if(!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    res.locals.session = req.session;
    next();
});

app.use('/', routes);

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
