// Imports
const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const connection = require('./database/database');

// Controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

// Models
const Category = require('./categories/Category');
const Article = require('./articles/Article');

// View Engine
app.set('view engine', 'ejs');

// Statis Files
app.use(express.static('public'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database Connection
connection.authenticate()
    .then(() => {
        console.log('Conexão com banco de dados realizada com sucesso');
    }).catch((error) => {
        console.log('Erro ao se conectar com o banco de dados', error.message);
    });

// Routes
app.use('/', categoriesController);
app.use('/', articlesController);

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'desc']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });
    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            });
        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        console.log(category);
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories})
            });
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log('Servidor iniciado. Porta:', port);
});