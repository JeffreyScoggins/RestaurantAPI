const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    categoryUuid: { type: String, unique: true, required: true },
    categoryName: { type: String, unique: false,  required: true },
    orgUuid: { type: String, required: true },
    imageData: { type: String, required: false},
    imageName: { type: String, required: false},
    imageType: { type: String, required: false},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Category', schema);
