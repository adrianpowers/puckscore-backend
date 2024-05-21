const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const bcrypt = require("bcrypt");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: "uploads/" });

// Database Connection
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const users = [];

const Player = require("./models/player");

// Routes
const playerRoutes = require("./routes/playerRoutes");
const matchRoutes = require("./routes/matchRoutes");

app.post("/api/upload/:playerId", upload.single("profilePicture"), (req, res) => {
  const playerId = req.params.playerId;
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, 'uploads', `${playerId}.png`);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return res.status(500).json({ message: 'File upload failed' });

    res.json({ url: `/uploads/${playerId}.png` });
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);

// USER ROUTES

app.get("/users", (req, res) => res.json(users));
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});
app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.username === req.body.username);
  if (!user) res.status(400).send("User not found");
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success - logging in...");
    } else {
      res.send("Password Failure");
    }
  } catch {
    res.status(500).send();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
