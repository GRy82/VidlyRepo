const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Vidly! Try this endpoint: \'/api/genres\' ');
});

module.exports = router;