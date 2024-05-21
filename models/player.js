  const mongoose = require("mongoose");

  const nameSchema = new mongoose.Schema(
    {
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
    },
    { _id: false }
  );

  const playerInfoSchema = new mongoose.Schema({
    location: { type: String, required: false },
    year: { type: Number, min: 1960, max: 2100, required: false },
    height: { type: Number, required: false, default: 0 },
    wingspan: { type: Number, required: false, default: 0 },
    handPreference: { type: String, required: false },
    malletPreference: { type: String, required: false },
    favoriteShot: { type: String, required: false },
    playerBio: { type: String, maxLength: 1200, required: false },
  });

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
    uniqueToken: {
      type: String,
      required: true,
      unique: true,
    },
    activeStatus: {
      type: Boolean,
      required: true,
      default: true,
    },
    playerInfo: {
      type: playerInfoSchema,
      required: false,
      _id: false,
    },
    profilePicture: {
      type: String,
      default: null,
    }
  });

  // Pre-save hook to clean up uniqueToken after linking the profile
  playerSchema.pre("save", function (next) {
    if (this.isModified("uniqueToken") && this.uniqueToken === null) {
      this.uniqueToken = undefined;
    }
    next();
  });

  // Static method to create a unique token
  playerSchema.statics.generateUniqueToken = async function (
    firstName,
    lastName
  ) {
    let token = `${firstName}-${lastName}`;
    let existingPlayer = await this.findOne({ uniqueToken: token });
    let suffix = 1;

    while (existingPlayer) {
      token = `${firstName}-${lastName}-${suffix}`;
      existingPlayer = await this.findOne({ uniqueToken: token });
      suffix++;
    }

    return token;
  };

  const Player = mongoose.model("Player", playerSchema);

  module.exports = Player;
