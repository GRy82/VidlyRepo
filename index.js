const express = require('express');
const app = express();
const logger = require('./logger');
const authenticator = require('./authenticator');
const Joi = require('joi');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);
app.use(authenticator);

const genres = [
    { id: 1, genreTitle: 'sample-genre' },
    { id: 2, genreTitle: 'comedy' },
];

app.get('/', (req, res) => {
    res.send('Welcome to Vidly! Try this endpoint: \'/api/genres\' ');
});

app.get('/api/genres', (req, res) => {
    
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    res.send(genre);
});

app.post('/api/genres', (req, res) => {
    const result = validateGenre(req.body);
    if(result.error)
       return res.status(400).send(result.error.details[0].message);

    const genre = {
        id: genres.length + 1,
        genreTitle: req.body.genreTitle
    };

    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    const result = validateGenre(req.body);
    if(result.error) 
        return res.status(400).send(result.error.details[0].message);

    genre.genreTitle = req.body.genreTitle;
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    let index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

function validateGenre(genre){
    const schema =  Joi.object({
        genreTitle: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));