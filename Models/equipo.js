var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categoriaValida = {
    values: ['SECADOR', 'EVAPORADOR', 'CONDENSADOR', 'COMPRESOR'],
    message: '{VALUE} no es una categoria permitida, verifique si está escrito en mayúsculas'
}
var tipoValido = {
    values: ['UNIDAD-PAQUETE', 'CHILLER', 'SPLIT', 'SPLIT-DUCTEABLE'],
    message: '{VALUE} no es una categoria permitida, verifique si está escrito en mayúsculas'
}
var areaValida = {
    values: ['CLIMATIZACIÓN', 'ELECTROMECÁNICA', 'ELÉCTRICA', 'MECÁNICA', 'NEUMÁTICA'],
    message: '{VALUE} no es una categoria permitida, verifique si está escrito en mayúsculas'
}

var equipoSchema = new Schema({
    marca: ({ type: String, required: [true, 'La marca es un campo necesario'] }),
    modelo: ({ type: String, required: [true, 'El modelo es necesario'] }),
    categoria: ({ type: String, required: true, default: 'EVAPORADOR', enum: categoriaValida }),
    tipo: ({ type: String, required: true, default: 'SPLIT', enum: tipoValido }),
    area: ({ type: String, required: true, default: 'CLIMATIZACIÓN', enum: areaValida }),
    descripcion: { type: String, required: false },
    img: { type: String, required: false },

    localidad: ({ type: Schema.Types.ObjectId, ref: 'Localidad', required: [true, 'Es necesario asigarlo a una localidad'] }),
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'equipos' });





// exportacion

module.exports = mongoose.model('Equipo', equipoSchema);