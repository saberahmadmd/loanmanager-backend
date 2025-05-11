const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const loanRoutes = require('./routes/loans');
const statsRoutes = require('./routes/stats');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/loans', loanRoutes);
app.use('/api/stats', statsRoutes);

// Connection to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));