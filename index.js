const express = require('express');
const app = express();
const Joi = require('joi');

const genres = [
    { id: 1, genre: 'sample-genre' }
];

app.get('/', (req, res) => {
    res.send('Welcome to Vidly! Try this endpoint: \'/api/genres\' ');
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('genre not found.');

    res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));