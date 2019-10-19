//Requieres
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();

//CORDS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//app.use(express.json());


//Importar rutas
var appRoutes = require('./routes/app');
var ownerRoutes = require('./routes/owner');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var petRoutes = require('./routes/pet');
var pubRoutes = require('./routes/publication');

//Conexion a la BD
mongoose.connect('mongodb://localhost:27017/appMascotas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// mongoose.connect('mongodb+srv://cmacha:123@cluster0-aubo3.gcp.mongodb.net/test?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, (err, res) => {
//     if (err) throw err;
//     console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
// });

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serverIndex(__dirname + '/uploads'));

//Rutas
app.use('/public', pubRoutes);
app.use('/pet', petRoutes);
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/login', loginRoutes);
app.use('/owner', ownerRoutes);
app.use('/', appRoutes);

//Escuchar peticion
// app.listen(3000, () => {
//     console.log('Express server: \x1b[32m%s\x1b[0m', 'Online');
// })
app.listen(parseInt(process.env.PORT) || 8080, () => {
    console.log('Express server puerto 3000: online');
  });