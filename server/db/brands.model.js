const mongoose = require('mongoose');
const { Schema } = mongoose;

const FavouriteBrand = new Schema({
  name: String,
});

module.exports = mongoose.model('FavouriteBrand', FavouriteBrand);
