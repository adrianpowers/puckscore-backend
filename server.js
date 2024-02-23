const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/api/players', playerRoutes);
// app.use("/api/games", gameRoutes);
// app.use("/api/sets", setRoutes);
// app.use("/api/matches", matchRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});