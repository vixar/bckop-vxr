var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../Models/user');
var Hospital = require('../Models/hospital');
var Medico = require('../Models/medico');

var app = express();

// default options
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Validar tipos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensje: 'Tipo no valido',
            errors: { message: 'Los tipos validos son: ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensje: 'No seleccionó algo',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obetener nombre del archivo
    var archivo = req.files.imagen;
    var shortName = archivo.name.split('.');
    var extensionArchivo = shortName[shortName.length - 1]

    // EXTENSIONES DE IMAGENES ACEPTADAS
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });

    }

    // Nombre del archivo personalizado

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extensionArchivo}`;


    // Mover el archivo del temp a un path específico

    var pathArchivo = `./uploads/${tipo}/${ nombreArchivo }`;

    archivo.mv(pathArchivo, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido correctamente',
        //     extensionArchivo: extensionArchivo
        // });

    });
});


function subirPorTipo(tipo, id, nombreArchivo, res) {


    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: 'El usuario que intenta actualizar no existe en la base de datos'
                });

            }

            var pathAntiguo = './uploads/usuarios/' + usuario.img;

            // si existe una imagen, elimina la imagen anterior

            if (fs.existsSync(pathAntiguo)) {

                fs.unlink(pathAntiguo);

            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: 'El hospital que intenta actualizar no existe en la base de datos'
                });

            }

            var pathAntiguo = './uploads/hospitales/' + hospital.img;

            // si existe una imagen, elimina la imagen anterior

            if (fs.existsSync(pathAntiguo)) {

                fs.unlink(pathAntiguo);

            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de hospital actualizada',
                    hospital: hospitalActualizado,
                    imagen: hospital.img,
                    pathAntiguo: pathAntiguo
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Médico no existe',
                    errors: 'El médico que intenta actualizar no existe en la base de datos'
                });

            }

            var pathAntiguo = './uploads/medicos/' + medico.img;

            // si existe una imagen, elimina la imagen anterior

            if (fs.existsSync(pathAntiguo)) {

                fs.unlink(pathAntiguo);

            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen del médico actualizada',
                    medico: medicoActualizado,
                    imagen: medico.img,
                    pathAntiguo: pathAntiguo
                });

            });
        });
    }
}


// exportaciones de rutas
module.exports = app;