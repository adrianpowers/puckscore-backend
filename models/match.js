const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  playerOne: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  playerTwo: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  playerOneScore: { type: Number, default: 0 },
  playerTwoScore: { type: Number, default: 0 },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
});

const setSchema = new mongoose.Schema({
  games: [ { type: mongoose.Schema.Types.ObjectId, ref: "Game" } ],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
});

const matchSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Array of players in the match
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  date: { type: Date, default: Date.now }, // Date of the match
  inProgress: { type: Boolean, default: true },
  pendingApproval: { type: Boolean, default: true },
  sets: [ { type: mongoose.Schema.Types.ObjectId, ref: "Set" } ], // Array of sets in the match
});

const Match = mongoose.model("Match", matchSchema);
const Set = mongoose.model("Set", setSchema);
const Game = mongoose.model("Game", gameSchema);

module.exports = [Match, Set, Game];
