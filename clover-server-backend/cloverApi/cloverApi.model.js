const mongoose = require('mongoose');
let uuid = require('uuid');
const Schema = mongoose.Schema;

const schema = new Schema({
  merchant_id: { type: String, required: false },
  client_id: { type: String, required: false },
  category_id: { type: String, required: false },
  code: { type: String, required: false },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ApiAuth', schema);
