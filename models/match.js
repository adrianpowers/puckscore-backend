const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  date: { type: Date, default: Date.now },
  outcome: String,
  sets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Set' }]
});

module.exports = mongoose.model('Match', matchSchema);
