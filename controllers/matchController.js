const [Match, Set, Game] = require("../models/match");
const Player = require("../models/player");

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
    const matchId = req.params.matchId;
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createMatch = async (req, res) => {
  try {
    const { players } = req.body;

    const newMatch = new Match({
      players: players,
    });

    await newMatch.save();

    const populatedMatch = await Match.findById(newMatch._id).populate(
      "players"
    );

    res.status(201).json(populatedMatch);
  } catch (err) {
    // Handle errors
    console.error("Error creating match:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createSet = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { games, winner } = req.body;

    // Find the match
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    // Create a new set instance using the Set model
    const newSet = new Set({ games, winner });
    console.log(newSet);
    // Save the new set to the match and update the match
    match.sets.push(newSet);
    await match.save();

    res
      .status(201)
      .json({ message: "Set created successfully", set: newSet._id });
  } catch (error) {
    console.error("Error creating set:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createGame = async (req, res) => {
  try {
    const { matchId, setId } = req.params;
    const { playerOne, playerTwo, playerOneScore, playerTwoScore, winner } =
      req.body;

    const set = await Set.findById(setId);

    if (!set) {
      return res.status(404).json({ message: "Set not found." });
    }

    const newGame = new Game({
      playerOne,
      playerTwo,
      playerOneScore,
      playerTwoScore,
      winner,
    });

    set.games.push(newGame);
    await set.save();

    res
      .status(201)
      .json({ message: "Game created successfully", game: newGame });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  createSet,
  createGame,
  // updateScore
};
