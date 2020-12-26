const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.get('/admin/users', (req, res) => {
    res.send('Listagem de usuários');
});

router.get('/admin/users/new', (req, res) => {
    res.render('admin/users/new');
});

router.post('/users/save', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if(user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/admin/users');
            }).catch((err) => {
                res.redirect('/admin/users');
            });
        } else {
            res.redirect('/admin/users/new')
        }
    });
});

module.exports = router;