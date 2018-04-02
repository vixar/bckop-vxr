var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    medico: [{ type: Schema.Types.ObjectId, ref: 'Medico', required: [true, 'El id del médico es un campo obligatorio '] }]
}, { collection: 'hospitales' });

module.exports = mongoose.model('Hospital', hospitalSchema);