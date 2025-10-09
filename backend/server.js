const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // Body parser for JSON data

// A simple test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));