const [Match, Set, Game]  = require('../models/match');
const Player = require('../models/player');

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMatchById = async (req, res) => {
  try {
    const matchId = req.params.id;
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    console.log(match);
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const createMatch = async (req, res) => {
  try {
    const { players } = req.body;   

    const newMatch = new Match({
      players: players,
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
    getMatchById,
    createMatch,
    // createSet,
    // createGame,
    // updateScore
}