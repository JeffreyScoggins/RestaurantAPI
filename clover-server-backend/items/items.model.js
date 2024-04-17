const Modifier = require('../_helpers/db');


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique:false, required: true },
    orgUuid: { type: String, unique:false, required: true },
    categoryUuid: { type: String, unique: false, required: true },
    itemUuid: { type: String, unique: true, required: true },
    price: { type: Number, unique: false, required: true },
    containsOptions: { type: Boolean, default: false },
    options: { type: [Modifier], required: false },
    selectedOptions: { type: String, required: false },
    optionCapacity: { type: Number, unique: false},
    minimumOptionsSelection: { type: Number, default: 0},
    imageData: { type: String, required: false},
    imageName: { type: String, required: false},
    imageType: { type: String, required: false},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Item', schema);
