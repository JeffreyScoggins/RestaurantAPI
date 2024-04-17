const Modifier = require('../_helpers/db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: false, required: true },
    orgUuid: { type: String, required: true },
    itemUuid: { type: String, unique: false, required: true },
    price: { type: Number, unique: false, required: true },
    tableUuid: { type: String, unique: false, required: true },
    selectedOptions: { type: String, required: false },
    createdDate: { type: Date, required: true, expires: 2678400},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('OrderHistory', schema);
