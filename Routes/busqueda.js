var express = require('express');

var app = express();

var Hospital = require('../Models/hospital');
var Medico = require('../Models/medico');
var User = require('../Models/user');


// Rutas
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i');

    // Async Process => Hospitales

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsers(busqueda, regex)
        ])
        .then(respuesta => {

            res.status(200).json({
                ok: true,
                hospitales: respuesta[0],
                medicos: respuesta[1],
                usuarios: respuesta[2],
            });

        });

});

// Rutas
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {


    var busqueda = req.params.busqueda;

    var tabla = req.params.tabla;

    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsers(busqueda, regex)
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex)
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex)
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Error en la busqueda, intente revisar el parametro tabla: usuarios/medicos/hospitales'
            });

    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })

});

// Promises

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales)
                }

            });

    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos)
                }

            });

    });

}

function buscarUsers(busqueda, regex) {

    return new Promise((resolve, reject) => {

        User.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuario) => {
                if (err) {
                    reject('Error al cargar usario', err);
                } else {
                    resolve(usuario)
                }
            });

    });

}


// exportaciones de rutas
module.exports = app;