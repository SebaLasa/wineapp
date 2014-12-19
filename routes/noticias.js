var Noticia = require('../models/Noticia.js');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
//var idImage = 0;

if (!fs.existsSync('public/images/noticias')) {
    fs.mkdirSync('public/images/noticias');
};

/*if(idImage==0){
    fs.readdir('public/images/noticias', function (err, files) { // '/' denotes the root folder
        if (err) throw err;
        files.forEach( function (file) {
            idImage=idImage+1; 
        });
    });
};*/

exports.list = function(req, res, next) {
  	Noticia.find().sort('fecha').exec(function(err, noticias) {
			if (err) return next(err);
			res.json(noticias);
		});
};

exports.mobileList = function(req, res, next) {
    var today = new Date();
    today.setFullYear(today.getFullYear(), today.getMonth(), today.getDate() - 2);
    Noticia.find({fecha : { $gte: today}},{fecha:1, titulo:1, copete:1, image:1}).sort('fecha').exec(function(err, noticias) {
            if (err) return next(err);
            res.json(noticias);
        });
};

exports.get = function(req, res, next) {
	Noticia.findById(req.params.id, function(err, noticia) {
		if (err) return next(err);
		if (noticia == null) {
			res.status(404).send('Noticia not found!');
			return;
		}
		res.json(noticia);
	});
};

exports.create = function(req, res, next) {

		var form = new multiparty.Form();
        var upload = {noticia: ''};

        form.on('error', next);
        form.on('close', function () {
            var noticia = new Noticia(JSON.parse(upload.noticia));
            noticia.image = upload.image;
            noticia.save(function (err, noticia) {
                if (err) {
                    return next(Error.create('An error occurred trying save the Noticia.', { }, err));
                }
                res.status(201).end();
            });
        });
        // listen on part event for image file
        form.on('part', function (part) {
            if (part.name == 'noticia') {
                part.on('data', function (buffer) {
                    upload.noticia += buffer;
                });
            }
            if (part.name == 'file') {
                upload.image = path.join('images/noticias', req.params.id + part.filename.slice(part.filename.length-4);
                upload.fsfile = fs.createWriteStream(path.join('public', upload.image));
                part.pipe(upload.fsfile);
            }
        });
        form.parse(req);
    };


exports.update = function(req, res, next) {
        var form = new multiparty.Form();
        var upload = {noticia: ''};
        form.on('error', next);
        form.on('close', function () {
            var noticia = JSON.parse(upload.noticia);
            delete noticia._id;
            if (upload.image) {
                noticia.image = upload.image;
            }
            Noticia.findByIdAndUpdate(req.params.id, noticia, function (err, noticia) {
                if (err) {
                    return next(Error.create('An error occurred trying get the noticia.', { }, err));
                }
                res.status(200).end();
            });
        });

        // listen on part event for image file
        form.on('part', function (part) {
            if (part.name == 'noticia') {
                part.on('data', function (buffer) {
                    upload.noticia += buffer;
                });
            }
            if (part.name == 'file') {
                upload.image = path.join('images/noticias', req.params.id + part.filename.slice(part.filename.length-4);
                upload.fsfile = fs.createWriteStream(path.join('public', upload.image));
                part.pipe(upload.fsfile);
            }
        });
        form.parse(req);
};

exports.delete = function(req, res, next) {
	Noticia.findById(req.params.id, function(err, noticia) {
        if(noticia.image){
            fs.unlink("./public/" + noticia.image, function (err) {
                if (err) throw err;
                console.log('successfully deleted' + noticia.image);
            });
        }
		if (err) return next(err);
        if (noticia == null) {
            res.status(404).send('Noticia not found!');
            return;
        }
        noticia.remove(function(err) {
		if (err) return next(err);
		res.end();
        });
	});
};
