const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  orgUuid: { type: String, required: true },
  price: { type: Number, default: 0},
  priceAddon: { type: Number, default: null, required: false }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('modifiers', schema);
