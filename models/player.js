const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: String,
  stateRank: Number,
  worldRank: Number
});

module.exports = mongoose.model('Player', playerSchema);
