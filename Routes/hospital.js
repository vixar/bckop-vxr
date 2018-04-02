var express = require('express');


var app = express();

var mdAuth = require('../middlewares/auth');

var Hospital = require('../Models/hospital');
var Medico = require('../Models/medico');
// var User = require('../Models/user');


//=========================================
// Obtener Hospitales
//=========================================


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('medico', 'nombre')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });

                }

                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });

                });


            })

});



//=========================================
// Crear un nuevo Hospital
//=========================================

app.post('/', mdAuth.verificaToken, (req, res) => {

    // recibir peticion mediante solicitud http, entonces usamos (leer el cuerpo)
    var body = req.body;

    /* para crear un usuario o crear un objeto del modelo que creamos, entonces usamos
     las propiedades del modelo */
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.user._id,
        medico: body.medico
    });

    /* para guardarlo en la base de datos*/

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando hospital',
                errors: err
            });

        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved,
            user: req.user.nombre
        });

    });






});


//=========================================
// Actualizar un Usuario
//=========================================

app.put('/:id', mdAuth.verificaToken, (req, res) => {

    // Cómo obtener el id
    var id = req.params.id;
    var body = req.body;

    // verificar si un usuario tiene este id
    Hospital.findById(id, (err, hospital) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });

        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + 'no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.user._id;


        hospital.save((err, hospitalSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });

            }

            res.status(200).json({
                ok: true,
                hospital: hospitalSaved,
                user: req.user.nombre
            });


        });

    });

});

//=========================================
// Eliminar un Usuario: usando id   
//=========================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var nombre = req.user.nombre;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital con el id =>' + id,
                errors: err
            });

        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });

        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado,
            message: 'Hospital: ' + id + ': ' + hospitalBorrado.nombre + '=> ha sido eliminado de la base de datos',
            usuario: req.user.nombre
        });
    })

});






// exportaciones de rutas
module.exports = app;