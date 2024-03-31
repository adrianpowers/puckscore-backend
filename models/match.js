const gameSchema = new mongoose.Schema({
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // Player 1's ID
  challenged: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // Player 2's ID
  challengerScore: { type: Number, default: 0 }, // Player 1's score in the game
  challengedScore: { type: Number, default: 0 }, // Player 2's score in the game
});

const setSchema = new mongoose.Schema({
  games: [gameSchema], // Array of games in the set
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // Winner of the set
});

const matchSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Array of players in the match
  date: { type: Date, default: Date.now }, // Date of the match
  inProgress: true,
  sets: [setSchema] // Array of sets in the match
});

const Match = mongoose.model('Match', matchSchema);
