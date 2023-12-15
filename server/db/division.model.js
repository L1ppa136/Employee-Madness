const mongoose = require('mongoose');
const { Schema } = mongoose;

const DivisionSchema = new Schema({
  name: String,
  boss: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  budget: {
    type: Number,
    default: 5000000,
  },
  location: {
    city: String,
    country: String,
  },
});

module.exports = mongoose.model('Division', DivisionSchema);
