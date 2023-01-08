const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/all_projects');
    } else {
        res.render('index.ejs');
    }
});

router.get('/error', (req, res) => {
    res.render('error');
});

module.exports = router;