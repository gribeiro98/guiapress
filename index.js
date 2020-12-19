const express = require('express');
const app = express();
const port = 8080;

// View Engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Bem vindo!');
});

app.listen(port, () => {
    console.log('Servidor iniciado. Porta:', port);
});