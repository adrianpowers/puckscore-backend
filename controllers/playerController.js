const Player = require("../models/player");

// Controller functions
const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find({ activeStatus: true });
    res.json(players);
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
        { "name.firstName": { $regex: regexPattern } },
        { "name.lastName" : { $regex: regexPattern } },
        { "name.callsign": { $regex: regexPattern } },
      ],
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

const getPlayerById = async (req, res) => {
  try {
    const playerId = req.params.id;
    const player = await Player.findById(playerId);
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
    const {
      firstName,
      lastName,
      callsign,
      stateRank,
      worldRank,
      location,
      year,
      height,
      wingspan,
      handPreference,
      malletPreference,
      favoriteShot,
      playerBio
    } = req.body;

    // Generate a unique token
    const uniqueToken = await Player.generateUniqueToken(firstName, lastName);

    // Create a new player document
    const player = new Player({
      name: {
        firstName: firstName,
        callsign: callsign,
        lastName: lastName,
      },
      stateRank,
      worldRank,
      uniqueToken,
      playerInfo: {
        location,
        year,
        height,
        wingspan,
        handPreference,
        malletPreference,
        favoriteShot,
        playerBio
      }
    });

    // Save the player document
    await player.save();

    // Send the response
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = createPlayer;


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

// this one updates everyone else's
const updatePlayerStateRank = async (req, res) => {
  try {
    const playerId = req.params.id;
    const newStateRank = req.body.stateRank;

    // Find the player by ID
    const player = await Player.findById(playerId);
    const name = player.name;

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    if (player.stateRank === null) {
      player.stateRank = newStateRank;
      await player.save();

      await Player.updateMany(
        {
          stateRank: { $gte: newStateRank },
          name: { $ne: name }, // Exclude the active player
        },
        { $inc: { stateRank: 1 } }
      );
      res.status(200).json(player);
    } else {
      // Calculate the change in rank
      const rankChange = newStateRank - player.stateRank;

      // Update the rank of the player
      player.stateRank = newStateRank;
      await player.save();

      // Update the ranks of affected players
      if (rankChange < 0) {
        // Update players with a state rank greater than the old state rank and not the active player
        await Player.updateMany(
          {
            stateRank: { $gte: newStateRank, $lt: newStateRank - rankChange },
            name: { $ne: name }, // Exclude the active player
          },
          { $inc: { stateRank: 1 } }
        );
      }
      res.status(200).json(player);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// this one just updates one person's - doesn't update the relevant ranks
// will not be horribly useful in prod, this is mostly for testing
const updateSinglePlayerStateRank = async (req, res) => {
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
    const playerId = req.params.id;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    player.isActive = false;
    await player.save();

    res.status(200).json({ message: "Player deactivated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerByName,
  getPlayerById,
  createPlayer,
  updatePlayerName,
  updatePlayerCallsign,
  updatePlayerStateRank,
  updatePlayerWorldRank,
  deletePlayer,
};
