const express = require(express);
const router = express.Router();

const genres = [
    { id: 1, genreTitle: 'sample-genre' },
    { id: 2, genreTitle: 'comedy' },
];

router.get('/', (req, res) => {
    
    res.send(genres);
});

router.get('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    res.send(genre);
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) 
        return res.status(404).send('A genre with that id does not exist.');

    const result = validateGenre(req.body);
    if(result.error) 
        return res.status(400).send(result.error.details[0].message);

    genre.genreTitle = req.body.genreTitle;
    res.send(genre);
});

router.delete('/:id', (req, res) => {
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

module.exports = router;