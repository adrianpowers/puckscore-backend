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

    // Save the new set to the match and update the match
    match.sets.push(newSet);
    await match.save();

    // Retrieve the populated set object
    const populatedSet = await Set.findById(newSet._id).populate('games').exec();

    if (!populatedSet) {
      return res.status(404).json({ message: "Set not found." });
    }

    // Return the response with the populated set object
    res.status(201).json({ message: "Set created successfully", set: populatedSet });
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
    console.log(playerOne, playerTwo, playerOneScore, playerTwoScore);

    // Validate input
    if (!playerOne || !playerTwo || !playerOneScore || !playerTwoScore) {
      return res.status(400).json({ message: "Missing required fields." });
    }

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

    return res
      .status(201)
      .json({ message: "Game created successfully", game: newGame });
  } catch (error) {
    console.error("Error creating game:", error);
    return res
      .status(500)
      .json({ message: "Failed to create game. Please try again later." });
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
