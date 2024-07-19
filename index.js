require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const port = 3000;

// MongoDB connection
const mongoURI = process.env.MONGODB_URI; // Use the environment variable
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json()); // Ensure you have body parser middleware for POST requests

// Define Counter schema and model
const counterSchema = new mongoose.Schema({
  value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Initialize the counter if it doesn't exist
async function initializeCounter() {
  const count = await Counter.countDocuments();
  if (count === 0) {
    const counter = new Counter();
    await counter.save();
  }
}

initializeCounter().catch(err => console.error(err));

// Increment route
app.post('/increment', async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate({}, { $inc: { value: 1 } }, { new: true });
    res.json({ counter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decrement route
app.post('/decrement', async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate({}, { $inc: { value: -1 } }, { new: true });
    res.json({ counter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current counter value
app.get('/value', async (req, res) => {
  try {
    const counter = await Counter.findOne();
    res.json({ counter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
