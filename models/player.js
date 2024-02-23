const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  callsign: {
    type: String,
    required: false
  },
  stateRank: {
    type: Number,
    default: 0
  },
  worldRank: {
    type: Number,
    default: 0
  }
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
