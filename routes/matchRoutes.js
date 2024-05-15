const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

router.get('/', matchController.getAllMatches);
router.get('/:matchId', matchController.getMatchById);
router.get('/:matchId/sets/:setId', matchController.getGamesInSet);
router.post('/', matchController.createMatch);
router.post('/:matchId', matchController.createSet);
router.post('/:matchId/sets/:setId', matchController.createGame);


module.exports = router;