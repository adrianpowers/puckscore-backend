const mongoose = require("mongoose");

const nameSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  callsign: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
}, { _id: false } );

const playerSchema = new mongoose.Schema({
  name: {
    type: nameSchema,
    required: true,
  },
  stateRank: {
    type: Number,
    default: 0,
  },
  worldRank: {
    type: Number,
    default: 0,
  },
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
