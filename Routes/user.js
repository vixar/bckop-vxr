var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/auth');

var app = express();

var User = require('../Models/user');


//=========================================
// Obtener Usuarios
//=========================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    User.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, users) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });

                }

                User.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        users: users,
                        total: conteo
                    });

                });



            });

});



//=========================================
// Crear un nuevo Usuario
//=========================================

app.post('/', mdAuth.verificaToken, (req, res) => {

    // recibir peticion mediante solicitud http, entonces usamos (leer el cuerpo)
    var body = req.body;

    /* para crear un usuario o crear un objeto del modelo que creamos, entonces usamos
     las propiedades del modelo */
    var users = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    /* para guardarlo en la base de datos*/

    users.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando usuario',
                errors: err
            });

        }

        res.status(201).json({
            ok: true,
            user: userSaved,
            tokenUser: req.user
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
    User.findById(id, (err, user) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });

        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        user.nombre = body.nombre;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });

            }

            userSaved.password = ':)';

            res.status(200).json({
                ok: true,
                user: userSaved,
                tokenUser: req.user
            });


        });

    });

});

//=========================================
// Eliminar un Usuario: usando id   
//=========================================

app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario con el id =>' + id,
                errors: err
            });

        }

        if (!userBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });

        }

        res.status(200).json({
            ok: true,
            user: userBorrado,
            tokenUser: req.user,
            message: 'Usuario => ' + id + ' ha sido eliminado de la base de datos'
        });
    })

});

// exportaciones de rutas
module.exports = app;