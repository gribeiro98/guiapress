const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');

// View Engine
app.set('view engine', 'ejs');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log('Servidor iniciado. Porta:', port);
});