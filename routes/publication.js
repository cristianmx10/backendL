var express = require('express');
var app = express();
var Publication = require('../models/publication');
var Pet = require('../models/pet');
var nodemailer = require('nodemailer');
var Owner = require('../models/owner');


app.get('/perdidos', (req, res) => {
    Publication.find({ active: true })
        .populate('pet')
        .populate('owner')
        .exec((err, publications) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json(publications);
        })
});

app.get('/encontrados', (req, res) => {
    Publication.find({ active: false })
        .populate('pet')
        .populate('owner')
        .exec((err, publications) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json(publications);
        })
});

/**Id: id owner */
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Publication.find({ owner: id })
        .populate('pet').
        populate('owner')
        .exec((err, publ) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json(publ);
        })
});

// Crear pubicacion
app.post('/', (req, res) => {
    var body = req.body;
    var pub = new Publication({
        address: body.address,
        description: body.description,
        active: true,
        fechaP: body.fechaP,
        pet: body.pet,
        owner: body.owner
    });
    Pet.findByIdAndUpdate(
        body.pet,
        {
            status: false
        },
        (err, petUpdate) => {
            if (err) {
                return res.status(400).json(err);
            }
            pub.save((err, pubCreate) => {
                if (err) {
                    return res.status(400).json(err);
                }
                res.status(201).json(pubCreate);
            });
        }
    );
});

app.post('/notification', (req, res) => {
    var body = req.body;
    //Creamos el objeto de transporte
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cristianserva1999@gmail.com',
            pass: 'cristianmx10'
        }
    });
    var mensaje = `Una mascota se perdio en: ${body.address}; descripcion: ${body.description}`;
    Owner.find({ active: true, receiveEmail: true }, (err, owners) => {
        for (let i = 0; i < owners.length; i++) {
            const element = owners[i];
            var mailOptions = {
                from: 'cristianserva1999@gmail.com',
                to: `${element.email}`,
                subject: 'Mascota perdida | Little Brother',
                text: mensaje
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return;
                } else {
                    console.log('Email enviado: ' + info.response);
                }
            });
        }
    });
});

/**id: id de la mascota */
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Pet.findByIdAndUpdate(id, { status: true }, (err, petUpdate) => {
        if (err) {
            return res.status(400).json({ message: 'Error al actualizar mascota' });
        }
        Publication.findByIdAndUpdate(body._id, {
            active: false,
            fechaE: body.fechaE,
            notifica: body.notifica,
            addressE: body.addressE
        }, (err, publUpdate) => {
            if (err) {
                return res.status(400).json(err);
            }
            res.status(200).json(publUpdate);
        });
    });
});

/** Agregar mensaje */
app.put('/message/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    var mensaje = {
        telefono: body.telefono,
        message: body.message
    }

    Publication.findById(id, (err, pub) => {
        if (err) {
            return res.status(400).json(err);
        }
        if (!pub) {
            return res.status(400).json({ message: ' no existe' });
        }
        pub.message.push(mensaje);
        pub.save((err, pubUp) => {
            if (err) {
                return res.status(400).json(err);
            }
            res.status(200).json(pubUp)
        });
    });
});

module.exports = app;
