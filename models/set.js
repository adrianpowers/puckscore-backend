const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  setNumber: Number,
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
});

module.exports = mongoose.model('Set', setSchema);
