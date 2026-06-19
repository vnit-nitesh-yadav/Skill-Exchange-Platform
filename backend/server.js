const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const initSocket = require('./socket'); // Import socket initialization

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create an HTTP server for both Express and Socket.IO
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Initialize your routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/search', require('./routes/searchSkills'));
app.use('/api/connection', require('./routes/connection'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/reviews', require('./routes/reviews'));

// Initialize Socket.IO with the server
initSocket(server);

// Start the server on the defined port
const PORT = process.env.PORT ;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
