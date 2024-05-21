const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  playerOneScore: { type: Number, default: 0 },
  playerTwoScore: { type: Number, default: 0 },
  gameWinner: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
});

const setSchema = new mongoose.Schema({
  games: [gameSchema],
  playerOne: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  playerTwo: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  gameWinner: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
});

const matchSchema = new mongoose.Schema({
  players: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      firstName: String,
      callsign: { type: String, required: false },
      lastName: String,
      stateRank: Number,
      worldRank: Number,
    },
  ],  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  date: { type: Date, default: Date.now }, // Date of the match
  inProgress: { type: Boolean, default: true },
  pendingApproval: { type: Boolean, default: true },
  sets: [setSchema], // Array of sets in the match
});

const Match = mongoose.model("Match", matchSchema);
const Set = mongoose.model("Set", setSchema);
const Game = mongoose.model("Game", gameSchema);

module.exports = [Match, Set, Game];
