var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var Owner = require('../models/owner');
var Pet = require('../models/pet');
var Publication = require('../models/publication');
var fs = require('fs');

// Default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos validos
    var tiposValidos = ['owners', 'pets', 'publics'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({ message: 'Tipo no valido' });
    }

    if (!req.files) {
        return res.status(400).json({ message: 'Error' });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1].toLowerCase();

    // Solo estas extensiones
    var extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({ message: 'No valido' });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo 
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json(err);
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'owners') {
        Owner.findById(id, (err, owner) => {
            if (!owner) {
                return res.status(400).json({ message: 'No existe owner' });
            }
            if (err) {
                return res.status(400).json(err);
            }
            // Si existe, elimina img anterior
            var pathViejo = './uploads/owners/' + owner.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function (err) {
                    return console.error(err);
                });
            }
            owner.img = nombreArchivo;
            owner.save((err, imgUpload) => {
                if (err) {
                    return res.status(400).json(err);
                }
                imgUpload.password = '***';
                return res.status(200).json(imgUpload);
            });
        });
    }
    if (tipo === 'pets') {
        Pet.findById(id, (err, pet) => {
            if (!pet) {
                return res.status(400).json({ message: 'No existe pet' });
            }
            if (err) {
                return res.status(400).json(err);
            }
            // Si existe, elimina img anterior
            var pathViejo = './uploads/pets/' + pet.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function (err) {
                    return console.error(err);
                });
            }
            pet.img = nombreArchivo;
            pet.save((err, imgUpload) => {
                if (err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json(imgUpload);
            });
        });

    }
    if (tipo === 'publics') {
        Publication.findById(id, (err, publication) => {
            if (!publication) {
                return res.status(400).json({ message: 'publicacion no existe' });
            }
            if (err) {
                return res.status(400).json(err);
            }
            var pathViejo = './uploads/publics/' + publication.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function (err) {
                    return console.error(err);
                });
            }
            publication.img = nombreArchivo;
            publication.save((err, imgUpload) => {
                if (err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json(imgUpload);
            });
        });
    }
}

module.exports = app;
