const [Match, Set, Game] = require("../models/match");
const Player = require("../models/player");

const getAllMatches = async (req, res) => {
  try {
    // Fetch all matches
    const matches = await Match.find();

    // Check if matches were found
    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: "No matches found" });
    }

    // Send the response
    res.json(matches);
  } catch (err) {
    // Handle errors
    console.error("Error fetching matches:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getAllMatches;


const getAllMatchesByPlayer = async (req, res) => {
  try {
    const playerId = req.params.playerId;

    // Find all matches where the specified player has participated
    const matches = await Match.find({ "players": playerId });

    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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
    const { players, date } = req.body;  // Assume 'players' is an array of player IDs and 'date' is the match date

    // Fetch player details
    const playerDetails = await Promise.all(players.map(async playerId => {
      const player = await Player.findById(playerId);
      if (!player) {
        throw new Error(`Player with ID ${playerId} not found`);
      }
      return {
        _id: player._id,
        firstName: player.name.firstName,
        callsign: player.name.callsign,
        lastName: player.name.lastName,
        stateRank: player.stateRank,
        worldRank: player.worldRank,
      };
    }));

    // Create new match document with player details
    const newMatch = new Match({
      players: playerDetails,
      date,
    });

    await newMatch.save();

    // Respond with the created match document
    res.status(201).json(newMatch);
  } catch (err) {
    // Handle errors
    console.error("Error creating match:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const createSet = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { games, winner = null } = req.body;

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
    const populatedSet = match.sets.id(newSet._id);

    if (!populatedSet) {
      return res.status(404).json({ message: "Set not found." });
    }

    // Return the response with the populated set object
    res
      .status(201)
      .json({ message: "Set created successfully", set: populatedSet });
  } catch (error) {
    console.error("Error creating set:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createGame = async (req, res) => {
  try {
    const { matchId, setId } = req.params;
    const { playerOneScore, playerTwoScore, gameWinner } = req.body;

    // Input Validation
    const missingFields = [];
    if (!gameWinner) missingFields.push("gameWinner");
    if (playerOneScore === undefined || playerOneScore === null)
      missingFields.push("playerOneScore");
    if (playerTwoScore === undefined || playerTwoScore === null)
      missingFields.push("playerTwoScore");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const foundMatch = await Match.findOne({ _id: matchId, "sets._id": setId });

    if (!foundMatch) {
      return res.status(404).json({ message: `Match ${matchId} not found.` });
    }

    const set = foundMatch.sets.find((set) => set._id.toString() === setId);

    if (!set) {
      return res
        .status(404)
        .json({ message: `Set ${setId} not found in match ${matchId}.` });
    }

    const newGame = new Game({
      playerOneScore,
      playerTwoScore,
      gameWinner,
    });

    const update = {
      $push: {
        "sets.$.games": newGame,
      },
    };

    await Match.updateOne({ _id: matchId, "sets._id": setId }, update);

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

const getGamesInSet = async (req, res) => {
  try {
    const { matchId, setId } = req.params;
    const foundMatch = await Match.findOne({ _id: matchId, "sets._id": setId });

    if (!foundMatch) {
      return res.status(404).json({ message: "Match not found." });
    }

    const set = foundMatch.sets.find((set) => set._id.toString() === setId);

    if (!set) {
      return res.status(404).json({ message: "Set not found." });
    }

    const games = set.games;

    return res.status(200).json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch games. Please try again later." });
  }
};


module.exports = {
  getAllMatches,
  getMatchById,
  getAllMatchesByPlayer,
  getGamesInSet,
  createMatch,
  createSet,
  createGame,
  // updateScore
};
