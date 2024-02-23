// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema for the game model
const matchSchema = new mongoose.Schema({
    challenger_name: { type: String, required: true },
    challenged_name: { type: String, required: true },
    challenger_state_rank: { type: Number, default: 0 },
    challenged_state_rank: { type: Number, default: 0 },
    challenger_world_rank: { type: Number, default: 0 },
    challenged_world_rank: { type: Number, default: 0 },
    sets_to_win: { type: Number, default: 1 },
    total_sets: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

// Create a Mongoose model based on the schema
const Match = mongoose.model('Match', matchSchema);

// Define a route to create a new match
app.post('/api/matches/create', async (req, res) => {
    try {
        // Create a new match instance from the request body
        const newMatch = new Match(req.body);

        // Save the match to the database
        const savedMatch = await newMatch.save();

        // Respond with the saved match details
        res.json(savedMatch);
    } catch (err) {
        // If an error occurs, respond with an error message
        res.status(500).json({ error: 'Failed to create match' });
    }
});

// Define other routes and middleware as needed

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
