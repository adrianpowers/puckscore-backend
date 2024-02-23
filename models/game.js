const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameNumber: Number,
  player1Score: Number,
  player2Score: Number
});

module.exports = mongoose.model('Game', gameSchema);
