const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, 
  challenged: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, 
  challengerScore: { type: Number, default: 0 },
  challengedScore: { type: Number, default: 0 }, 
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
});

const setSchema = new mongoose.Schema({
  games: [gameSchema], 
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, 
});

const matchSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Array of players in the match
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  date: { type: Date, default: Date.now }, // Date of the match
  inProgress: { type: Boolean, default: true },
  sets: [setSchema] // Array of sets in the match
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;