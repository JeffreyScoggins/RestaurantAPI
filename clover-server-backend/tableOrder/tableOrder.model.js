const Modifier = require('../_helpers/db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    tableUuid: { type: String, unique: true, required: true },
    tableName: { type: String, required: true },
    total: { type: Number, unique: false, required: true },
    orgUuid: { type: String, required: true },
    orderItems:[ {
          _id: {type: String, unique: false, required: false},
          name: { type: String, unique: false, required: false },
          categoryUuid: { type: String, unique: false, required: false },
          itemUuid: { type: String, unique: false, required: false },
          containsOptions: { type: Boolean, default: false },
          options: { type: [Modifier], required: false },
          selectedOptions: { type: [String], required: false },
          optionCapacity: { type: Number, unique: false, required: false },
          price: { type: Number, unique: false, required: false }
      }
      ]
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TableOrder', schema);
