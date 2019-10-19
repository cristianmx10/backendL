var express = require('express');
var app = express();
var Pet = require('../models/pet');

// Listar mis mascotas
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Pet.find({ owner: id, status: true })
        .populate('owner')
        .exec((err, pets) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json(pets);
        });
});

// Listar mascotas perdidas
app.get('/perdidos/:id', (req, res) => {
    var id = req.params.id;
    Pet.find({ owner: id, status: false })
        .populate('owner')
        .exec((err, pets) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json(pets);
        });
});

// Crear mascotas
app.post('/', (req, res) => {
    var body = req.body;
    var pet = new Pet({
        namepet: body.namepet,
        // king: body.king,
        born: body.born,
        race: body.race,
        sexo: body.sexo,
        size: body.size,
        colour: body.colour,
        active: body.active,
        status: true,
        description: body.description,
        owner: body.owner,
        img: body.img
    });
    pet.save((err, petCreado) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.status(201).json(petCreado);
    });
});

// Actualizar mascota
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Pet.findByIdAndUpdate(
        id,
        {
            namepet: body.namepet,
            king: body.king,
            born: body.born,
            race: body.race,
            sexo: body.sexo,
            size: body.size,
            colour: body.colour,
            description: body.description,
            img: body.img
        },
        (err, petUpdate) => {
            if (err) {
                return res.status(400).json({message: 'Error al actualizar pet'});
            }
            res.status(200).json(petUpdate);
        }
    )
});

module.exports = app;