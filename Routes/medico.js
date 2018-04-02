var express = require('express');


var app = express();

var mdAuth = require('../middlewares/auth');

var Hospital = require('../Models/hospital');
var Medico = require('../Models/medico');
// var User = require('../Models/user');


//=========================================
// Obtener Médico
//=========================================


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        // .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });

                }

                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                });

            })

});


//=========================================
// Crear un nuevo médico
//=========================================

app.post('/', mdAuth.verificaToken, (req, res) => {

    // recibir peticion mediante solicitud http, entonces usamos (leer el cuerpo)
    var body = req.body;

    /* para crear un usuario o crear un objeto del modelo que creamos, entonces usamos
     las propiedades del modelo */
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.user._id,
        hospital: body.hospital
    });

    /* para guardarlo en la base de datos*/

    medico.save((err, medicoSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando medico',
                errors: err
            });

        }

        res.status(201).json({
            ok: true,
            medico: medicoSaved,
            user: req.user.nombre
        });

    });






});


// //=========================================
// // Actualizar un Usuario
// //=========================================

app.put('/:id', mdAuth.verificaToken, (req, res) => {

    // Cómo obtener el id
    var id = req.params.id;
    var body = req.body;

    // verificar si un usuario tiene este id
    Medico.findById(id, (err, medico) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });

        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + 'no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.user._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });

            }

            res.status(200).json({
                ok: true,
                hospital: medicoSaved
                    // user: req.user.nombre
            });


        });

    });

});

// //=========================================
// // Eliminar un Usuario: usando id   
// //=========================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var nombre = req.user.nombre;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico con el id =>' + id,
                errors: err
            });

        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });

        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado,
            message: 'Medico: ' + id + ': ' + medicoBorrado.nombre + '=> ha sido eliminado de la base de datos',
            usuario: req.user.nombre
        });
    })

});






// exportaciones de rutas
module.exports = app;