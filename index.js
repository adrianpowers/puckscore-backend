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
// Define other routes and middleware as needed

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
