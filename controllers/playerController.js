const Player = require("../models/player");

// Controller functions
const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlayerByName = async (req, res) => {
    try {
      const playerName = req.params.name;
      // Create a regex pattern to match any player name or callsign containing the provided string
      const regexPattern = new RegExp(playerName, "i");
      const player = await Player.find({
        $or: [
          { name: { $regex: regexPattern } },
          { callsign: { $regex: regexPattern } }
        ]
      });
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.status(200).json(player);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

const createPlayer = async (req, res) => {
  try {
    const { name, callsign, stateRank, worldRank } = req.body;
    const player = new Player({ name, callsign, stateRank, worldRank });
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePlayerName = async (req, res) => {
  try {
    const playerId = req.params.id;
    const newName = req.body.name;

    // Find the player by ID
    const player = await Player.findByIdAndUpdate(
      playerId,
      { name: newName },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePlayerCallsign = async (req, res) => {
  try {
    const playerId = req.params.id;
    const newCallsign = req.body.callsign;

    // Find the player by ID
    const player = await Player.findByIdAndUpdate(
      playerId,
      { callsign: newCallsign },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePlayerStateRank = async (req, res) => {
  try {
    const playerId = req.params.id;
    const newStateRank = req.body.stateRank;

    // Find the player by ID
    const player = await Player.findByIdAndUpdate(
      playerId,
      { stateRank: newStateRank },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePlayerWorldRank = async (req, res) => {
  try {
    const playerId = req.params.id;
    const newWorldRank = req.body.worldRank;

    // Find the player by ID
    const player = await Player.findByIdAndUpdate(
      playerId,
      { worldRank: newWorldRank },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    await player.remove();
    res.json({ message: "Player deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  getPlayerByName,
  createPlayer,
  updatePlayerName,
  updatePlayerCallsign,
  updatePlayerStateRank,
  updatePlayerWorldRank,
  deletePlayer,
};
