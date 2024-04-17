const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    merchantId: { type: String, required: true },
    isCategory: { type: Boolean, default: false },
    cloverDataId: { type: String, unique: false,  required: true },
    cloverDataName: { type: String, unique: false,  required: true },
    imageData: { type: String, required: false },  
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Image', schema);
