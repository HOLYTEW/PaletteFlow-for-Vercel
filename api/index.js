const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Define a route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Define routes for additional pages
app.get('/tool', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/tool.html'));
});

app.get('/palette', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/palette.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Sorry, that page does not exist!');
});

// Export the Express app for Vercel's serverless function
module.exports = app;