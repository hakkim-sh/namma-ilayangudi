require('dotenv').config();

const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const listingRoutes = require('./routes/listingRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Enga Ooru API is running' });
});

app.use('/api/listings', listingRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Keep API errors in a predictable format for clients.
app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid request data' });
  }

  console.error(error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not configured');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log(`Enga Ooru API listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
