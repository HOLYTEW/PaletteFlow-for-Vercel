const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tool', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'tool.html'));
});

app.get('/palette', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'palette.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.use((req, res, next) => {
    res.status(404).send('Sorry, that page does not exist!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});