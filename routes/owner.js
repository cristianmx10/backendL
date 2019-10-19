var express = require('express');
var app = express();
var Owner = require('../models/owner');
var bcrypt = require('bcryptjs');

var mdAuth = require('../middlewares/autenticacion');
var nodemailer = require('nodemailer');


// listar usuario
app.get('/', mdAuth.verificaToken, (req, res) => {
    Owner.find({}, (err, owners) => {
        if (err) {
            return;
        }
        res.status(200).json({ owners, owner: req.owner });
    });
});

// Crear usuario
app.post('/', (req, res) => {
    var body = req.body;
    var owner = new Owner({
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    });
    owner.save((err, ownerCreado) => {
        if (err) {
            return res.status(400).json(err);
        }
        //Creamos el objeto de transporte
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cristianserva1999@gmail.com',
                pass: 'cristianmx10'
            }
        });
        var mensaje = `Codigo de verificacion ${ownerCreado.id}`;
        var mailOptions = {
            from: 'cristianserva1999@gmail.com',
            to: `${ownerCreado.email}`,
            subject: 'Verificacion de correo electronico | Little Brother',
            text: mensaje
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });
        res.status(201).json(ownerCreado);
    });
});

app.put('/verification/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Owner.findOne({ email: body.email, _id: body.code }, (err, ownerDB) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!ownerDB) {
            return res.status(400).json({ message: 'Credenciales incorrectas - email' });
        }

        Owner.findByIdAndUpdate(
            id,
            { active: true },
            (err, ownerUpdate) => {
                if (err) {
                    return res.status(400).json({ message: 'error al actualizar' })
                }
                res.status(200).json(ownerUpdate);
            }
        );
    });
});

app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Owner.findByIdAndUpdate(
        id,
        {
            names: body.names,
            ap: body.ap,
            am: body.am,
            phone: body.phone,
            dni: body.dni,
            facebook: body.facebook
        },
        (err, ownerUpdate) => {
            if (err) {
                return res.status(400).json({ message: 'Error al actualizar' });
            }
            res.status(200).json(ownerUpdate);
        }
    );
});

app.put('/email/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Owner.findByIdAndUpdate(
        id,
        {
            receiveEmail: body.receiveEmail
        },
        (err, ownerUpdate) => {
            if (err) {
                return res.status(400).json({ message: 'Error al actualizar' });
            }
            res.status(200).json(ownerUpdate);
        }
    )
});

module.exports = app;
