const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
        id: { type: String, unique: true},
        clientId: { type: String, required: true},
        merchantId: { type: String, unique: true, required: true},
        cloverToken: { type: String, unique: true, required: true}
});

schema.set('toJSON', { virtuals: true});

module.exports = mongoose.model('Authentication', schema);