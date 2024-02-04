const express = require('express');
const router = express.Router();

router.post('/fetchResults/:numOf',
    (req, res) => {
        res.send('fetchResults');
    });

router.get('/search',
    (req, res) => {
        res.send('search');
    });
module.exports = router;


