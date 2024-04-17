const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    messageData: { type: String, required: true },
    orgUuid: { type: String, required: true },
    createdDate: { type: Date, default: Date.now(), expires: 50000}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ServerRequest', schema);
