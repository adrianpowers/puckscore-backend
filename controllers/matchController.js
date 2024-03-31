const Match = require('../models/match');
const Player = require('../models/player');

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createMatch = async (req, res) => {
  try {
    const { players } = req.body;
    
    const newMatch = new Match({
      players: players,
      sets: [],
    });

    await newMatch.save();
    
    const populatedMatch = await Match.findById(newMatch._id).populate('players');

    res.status(201).json(populatedMatch);
  } catch (err) {
    // Handle errors
    console.error("Error creating match:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    getAllMatches,
    // getMatchById,
    createMatch,
    // createSet,
    // createGame,
    // updateScore
}