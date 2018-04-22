// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');





// Inicializar varibales
var app = express();





// body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())






// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/operacionesDB', (err, res) => {

    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});



// Importar rutas

var appRoutes = require('./Routes/app');
var userRoutes = require('./Routes/user');
var loginRoutes = require('./Routes/login');
var hospitalRoutes = require('./Routes/hospital');
var medicoRoutes = require('./Routes/medico');
var busquedaRoutes = require('./Routes/busqueda');
var uploadRoutes = require('./Routes/upload');
var imagenesRoutes = require('./Routes/imagenes');




// Rutas
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);




// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});