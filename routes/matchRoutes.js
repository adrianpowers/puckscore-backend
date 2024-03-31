const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

router.get('/', matchController.getAllMatches);
// router.get('/:id', matchController.getMatchById);
router.post('/', matchController.createMatch);
// router.post('/:id/sets', matchController.createSet);
// router.post('/:id/sets/:setNum/game', matchController.createGame);
// router.put('/id:/sets/:setNum/game/:gameNum', matchController.updateScore);

module.exports = router;