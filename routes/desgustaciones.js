var Desgustacion = require('../models/Desgustacion.js');
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
//var idImage = 0;


if (!fs.existsSync('public/images/desgustaciones')) {
    fs.mkdirSync('public/images/desgustaciones');
};

/*if(idImage==0){
    fs.readdir('public/images/desgustaciones', function (err, files) { // '/' denotes the root folder
        if (err) throw err;
        files.forEach( function (file) {
            idImage=idImage+1; 
        });
    });
};*/

exports.list = function(req, res, next) {
    
  	Desgustacion.find().sort('fecha').sort('hora').exec(function(err, desgustaciones) {
			if (err) return next(err);
			res.json(desgustaciones);
		});
};

exports.imageList = function(req, res, next) {
    Desgustacion.find(},{image: 1}).exec(function(err, desgustaciones) {
            if (err) return next(err);
            res.json(desgustaciones);
        });
};

exports.mobileList = function(req, res, next) {
    var today = new Date();
    today.setFullYear(today.getFullYear(), today.getMonth(), today.getDate() - 2);
    Desgustacion.find({fecha : { $gte: today}},{fecha: 1, hora: 1, vinoteca: 1,  barrio: 1, image: 1})
    .sort('fecha').sort('hora').exec(function(err, desgustaciones) {
            if (err) return next(err);
            res.json(desgustaciones);
        });
};

exports.get = function(req, res, next) {
	Desgustacion.findById(req.params.id, function(err, desgustacion) {
		if (err) return next(err);
		if (desgustacion == null) {
			res.status(404).send('Desgustacion not found!');
			return;
		}

		res.json(desgustacion);
	});
};

exports.create = function(req, res, next) {

		var form = new multiparty.Form();
        var upload = {desgustacion: ''};
        

        form.on('error', next);
        form.on('close', function () {
        var desgustacion = new Desgustacion(JSON.parse(upload.desgustacion));

            desgustacion.image = upload.image;
            desgustacion.save(function (err, desgustacion) {
                if (err) {
                    return next(Error.create('An error occurred trying save the Desgustacion.', { }, err));
                }
                res.status(201).end();
            });
        });



        // listen on part event for image file
        form.on('part', function (part) {
            if (part.name == 'desgustacion') {
                part.on('data', function (buffer) {
                    upload.desgustacion += buffer;
                });
            }
            if (part.name == 'file') {
                upload.image = path.join('images/desgustaciones', req.params.id + part.filename.slice(part.filename.length-4);
                upload.fsfile = fs.createWriteStream(path.join('public', upload.image));
                part.pipe(upload.fsfile);
            }
        });
        form.parse(req);
    };


exports.update = function(req, res, next) {
        var form = new multiparty.Form();
        var upload = {desgustacion: ''};

        form.on('error', next);
        form.on('close', function () {
            var desgustacion = JSON.parse(upload.desgustacion);

            delete desgustacion._id;
            if (upload.image) {
                desgustacion.image = upload.image;
            }
            Desgustacion.findByIdAndUpdate(req.params.id, desgustacion, function (err, desgustacion) {
                if (err) {
                    return next(Error.create('An error occurred trying get the desgustacion.', { }, err));
                }
                res.status(200).end();
            });
        });

        // listen on part event for image file
        form.on('part', function (part) {
            if (part.name == 'desgustacion') {
                part.on('data', function (buffer) {
                    upload.desgustacion += buffer;
                });
            }
            if (part.name == 'file') {

                upload.image = path.join('images/desgustaciones', req.params.id + part.filename.slice(part.filename.length-4));
                upload.fsfile = fs.createWriteStream(path.join('public', upload.image));
                part.pipe(upload.fsfile);
            }
        });
        form.parse(req);
};

exports.delete = function(req, res, next) {
	Desgustacion.findById(req.params.id, function(err, desgustacion) {
        if(fs.existsSync('.public/' + desgustacion.image)){
            fs.unlink("./public/" + desgustacion.image, function (err) {
            if (err) throw err;
                console.log('successfully deleted' + desgustacion.image);
            });
        }
		if (err) return next(err);
        if (desgustacion == null) {
            res.status(404).send('Desgustacion not found!');
            return;
        }
        desgustacion.remove(function(err) {
		if (err) return next(err);
		res.end();
        });

	});
};
