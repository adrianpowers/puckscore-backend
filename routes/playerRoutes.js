const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

router.get("/", playerController.getAllPlayers);
router.get("/:name", playerController.getPlayerByName);
router.get("/:id", playerController.getPlayerById);
router.post("/", playerController.createPlayer);
router.put("/:id/name", playerController.updatePlayerName);
router.put("/:id/callsign", playerController.updatePlayerCallsign);
router.put("/:id/state-rank", playerController.updatePlayerStateRank);
router.put("/:id/world-rank", playerController.updatePlayerWorldRank);
router.delete("/:id", playerController.deletePlayer);

module.exports = router;
