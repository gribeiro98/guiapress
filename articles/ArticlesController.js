const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
    res.send('Lista de artigos');
});

module.exports = router;