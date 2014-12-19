var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var noticia = new Schema({
	fecha: { type: Date, required: true },
	titulo: { type: String, required: true },
	copete: { type: String, required: true },
	cuerpo:{ type: String, required: true },
	image: { type: String}
});

module.exports = mongoose.model('Noticia', noticia);