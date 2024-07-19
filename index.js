const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const port = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://adityasingh3210:on6XLyO7hCIWNRFo@cluster0.iozcvig.mongodb.net/?retryWrites=true&w=majority&appName=CounterApp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
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
