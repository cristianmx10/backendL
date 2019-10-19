var express = require('express');
var app = express();
var Owner = require('../models/owner');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function veryfy(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    return {
        names: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post('/google', async (req, res) => {
    var token = req.body.token;
    var googleUser = await veryfy(token)
        .catch(e => {
            return e;
        });
    Owner.findOne({ email: googleUser.email }, (err, ownerDB) => {
        if (err) {
            return err;
        }
        if (ownerDB) {
            if (ownerDB.google === false) {
                return res.status(400).json({ message: 'Debe usar su auth normal.' });
            } else {
                var token = jwt.sign({ owner: ownerDB }, SEED, { expiresIn: 28800 })
                res.status(200).json({ ownerDB, token });
            }
        } else {
            // El usuario no existe, crear
            var owner = new Owner();
            owner.names = googleUser.names;
            owner.email = googleUser.email;
            owner.img = googleUser.img;
            owner.google = true;
            owner.active = true;
            owner.password = '***';
            owner.save((err, ownerDB) => {
                var token = jwt.sign({ owner: ownerDB }, SEED, { expiresIn: 28800 })
                res.status(200).json({ ownerDB, token });
            });
        }
    });
});


app.post('/', (req, res) => {
    var body = req.body;
    Owner.findOne({ email: body.email }, (err, ownerDB) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (!ownerDB) {
            return res.status(400).json({ message: 'Credenciales incorrectas - email' });
        }
        if (!bcrypt.compareSync(body.password, ownerDB.password)) {
            return res.status(400).json({ message: 'Password incorrecto' });
        }
        
        // crear token
        ownerDB.password = '***';
        var token = jwt.sign({ owner: ownerDB }, SEED, { expiresIn: 28800 })
        res.status(200).json({ ownerDB, token });
    });
});

module.exports = app;
