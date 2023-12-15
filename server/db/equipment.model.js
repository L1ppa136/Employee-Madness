// https://mongoosejs.com/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const EquipmentSchema = new Schema({
  designation: String,
  type: String,
  amount: Number,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
