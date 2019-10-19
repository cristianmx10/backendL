var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var message = {
    message: String,
    telefono: Number,
    date: { type: Date, default: Date()}
};
var pubSchema = new Schema({
    address: String,
    description: String,
    active: Boolean,
    fechaP: Date,
    fechaE: Date,
    notifica: String,
    addressE: String,
    pet: {type: Schema.Types.ObjectId, ref: 'Pets', required: [true, 'El pet es necesario']},
    owner: {type: Schema.Types.ObjectId, ref: 'Owner', required: [true, 'El owner es necesario']},
    message: [message],
    img: String
});

module.exports = mongoose.model('Publication', pubSchema);