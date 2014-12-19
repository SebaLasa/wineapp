/**
 * Express modules.
 */
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('express-error-with-sources');


/**
 * Module dependencies
 */
var lessMiddleware = require('less-middleware');
require('mongoose').connect('mongodb://localhost/desgustavinos');
var desgustaciones = require('./routes/desgustaciones');
var noticias = require('./routes/noticias');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(lessMiddleware(path.join(__dirname, 'public')));

// public is the folder for static content (images, css, js, etc).
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// development only
if (!process.env.NODE_ENV || process.env.NODE_ENV == 'development') {
    // returns the exception detail to the client.
    app.use(errorHandler());
}

// routes
app.get('/api/desgustaciones', desgustaciones.list);
app.get('/api/desgustaciones/:id', desgustaciones.get);
app.post('/api/desgustaciones/', desgustaciones.create);
app.put('/api/desgustaciones/:id', desgustaciones.update);
app.delete('/api/desgustaciones/:id', desgustaciones.delete);

app.get('/mobile/degustaciones', desgustaciones.imageList);
app.get('/mobile/degustaciones', desgustaciones.mobileList);
app.get('/mobile/degustaciones/:id', desgustaciones.get);


app.get('/api/noticias', noticias.list);
app.get('/api/noticias/:id', noticias.get);
app.post('/api/noticias/', noticias.create);
app.put('/api/noticias/:id', noticias.update);
app.delete('/api/noticias/:id', noticias.delete);

app.get('/mobile/noticias', noticias.mobileList);
app.get('/mobile/noticias/:id', noticias.get);


// start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
