const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

const users = [];

// Routes
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);

// USER ROUTES

app.get("/users", (req, res) => res.json(users));
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword)
    const user = { username: req.body.username, password: hashedPassword }; 
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
} );
app.post("/users/login", async (req, res) => {
  const user = users.find(user => user.username === req.body.username);
  if(!user) res.status(400).send("User not found");
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success - logging in...")
    } else {
      res.send("Password Failure")
    }
  } catch {
    res.status(500).send();
  }
} );

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});