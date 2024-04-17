const Modifier = require('../_helpers/db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: false, required: true },
    orgUuid: { type: String, required: true },
    categoryUuid: { type: String, unique: false, required: true },
    itemUuid: { type: String, unique: false, required: true },
    price: { type: Number, unique: false, required: true },
    tableUuid: { type: String, unique: false, required: true },
    tableName: { type: String, unique: false, required: true },
    containsOptions: { type: Boolean, default: false },
    selectedOptions: { type: String, required: false },
    optionCapacity: { type: Number, unique: false, required: false },
    status: { type: String, default: 'submitted'},
    createdDate: { type: Date, default: Date.now },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', schema);
