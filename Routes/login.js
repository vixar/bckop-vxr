var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../Models/user');


//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//===================================
// Autenticación Google
//===================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        });

    User.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticacion normal'
                });
            } else {

                var token = jwt.sign({ user: usuarioDB }, SEED, { expiresIn: 14400 }) // 4 horas

                res.status(200).json({
                    ok: true,
                    user: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });

            }
        } else {
            //el usuaro no existe
            var usuario = new User();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // 4 horas

                res.status(200).json({
                    ok: true,
                    user: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });

            })

        }

    });

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Inicio de sesión exitoso',
    //     googleUser: googleUser
    // });

});


//===================================
// Autenticación normal
//===================================


app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });

        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - contraseña',
                errors: err
            });
        }

        // Crear token
        userDB.password = ':)';

        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }) // 4 horas

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });

    })


});





module.exports = app;