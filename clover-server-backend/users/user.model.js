const mongoose = require('mongoose');
let uuid = require('uuid');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    orgUuid: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    uuid: { type: String, required: true, default: uuid.v4()},
    role: { type: String, default: '1'},
    accountActive: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    imageData: { type: String, required: false},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
