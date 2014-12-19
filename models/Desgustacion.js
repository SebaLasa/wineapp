var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var desgustacion = new Schema({
	fecha: { type: Date, required: true },
	hora: { type: String, required: true },
	vinoteca:{ type: String, required: true },
	direccion: { type: String, required: true },
	barrio: {type: String, required: true},
	bodegas: {type: String, required: true},
	image: { type: String},
	descripcion: {type: String, required: true},
	precio: {type: String, required: true},
	telefono: {type: String, required: true},
	latitud: {type: String, required: true},
	longitud: {type: String, required: true}

});

module.exports = mongoose.model('Desgustacion', desgustacion);