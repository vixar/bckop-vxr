var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tipoLocalidad = {
    values: ['SUPER MERCADO', 'TIENDA COMERCIAL', 'PLANTA DE PRODUCCIÓN', 'EDIFICIO EMPRESARIAL', 'HOTEL', 'OTRO'],
    message: '{VALUE} no parece ser un valor valido, prueba colocando el tipo en mayusculas'
}

var clienteSchema = new Schema({
    nombre: ({ type: String, unique: true, required: [true, 'El nombre es necesario'] }),

    direccion: ({ type: String, required: [true, 'El La dirección es necesaria'] }),

    telefono: ({ type: Number, required: [true, 'Al menos un número es necesario'] }),

    rnc: ({ type: String, required: false, unique: true }),

    tipo: { type: String, required: true, default: 'TIENDA COMERCIAL', enum: tipoLocalidad },

    img: { type: String, required: false },

    localidad: ({ type: Schema.Types.ObjectId, ref: 'Localidad' }),
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'clientes' });


// validación de campos únicos
clienteSchema.plugin(uniqueValidator, { message: 'el {PATH} debe ser unico' });






// exportacion

module.exports = mongoose.model('Cliente', clienteSchema);