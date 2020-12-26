const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles});
    });
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    });
});

router.post('/articles/save', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title, { lower: true }),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });

});

router.post('/articles/delete', (req, res) => {
    var id = req.body.id;

    if(id != undefined) {
        if(!isNaN(id)) {

            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            });

        } else {
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', (req, res) => {
   var id = req.params.id;
   
   if(id != undefined) {
       if(!isNaN(id)) {
            Article.findByPk(id).then(article => {
                Category.findAll().then(categories => {
                    res.render('admin/articles/edit', {article: article, categories: categories});
                });
            }).catch(err => {
                res.redirect('/admin/articles');
            });
       } else {
           res.redirect('/admin/articles');
       }
   } else {
       res.redirect('/admin/articles');
   }
});

router.post('/articles/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({
        title: title,
        slug: slugify(title, { lower: true }),
        body: body,
        categoryId: category
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(err => {
        res.redirect('/admin/articles');
    });
});

router.get('/articles/page/:page', (req, res) => {
    var page = req.params.page;
    var offset = 0;
    var limit = 5
 
    if(isNaN(page) || page == 1) {
           offset = 0; 
    } else {
        offset = parseInt(page - 1) * limit;
    }

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'desc']
        ]
    }).then(articles => {
        var next = true;

        if(offset + limit  >= articles.count) {
            next = false;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('page', {result: result, categories: categories});
        });
    });

});

module.exports = router;