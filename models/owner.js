var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ownerSchema = new Schema({
    names: String,
    ap: String,
    am: String,
    phone: String,
    dni: String,
    facebook: String,
    departament: String,
    province: String,
    district: String, 
    email: {type: String, require :[true, 'el correo es necesario'], unique: true},
    password: String,
    img: String,
    google: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    code: { type: String,},
    receiveEmail: {type: Boolean, default: false}
});

module.exports = mongoose.model('Owner', ownerSchema);