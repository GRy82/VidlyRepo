const express = require('express');
const app = express();
const Joi = require('joi');

const genres = [
    { id: 1, genre: 'sample-genre' }
];

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));