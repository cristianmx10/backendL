var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var petSchema = new Schema({
    namepet: String,
    king: String,
    born: Date,
    race: String,
    sexo: Boolean,
    size: String,
    colour: String,
    active: Boolean,
    status: Boolean,
    description: String,
    img: String,
    owner: { type: Schema.Types.ObjectId, ref: 'Owner', required: [true, 'El owner es necesario']}
});

module.exports = mongoose.model('Pets', petSchema);
