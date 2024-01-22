const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const userControllers = require('../controllers/user.controllers');

let urlencoded = bodyParser.urlencoded({ extended: false });

/**
 * req and res are built-in objects that help to do a lot of stuff upon a new request-response cycle.
 * req: for input or url-encoded data (passed to the server in the url)
 */
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
})

router.get('/index', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
})

router.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
})

router.get('/coin', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/coin.html'));
})

router.get('/coin.html', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/coin.html'));
})

router.get('/wallet', urlencoded, function(req, res) {
    if (req.session.userId) {
        res.render('wallet', { title: 'My wallet', name: req.session.name, logStatus: true, logMode: '' });
    } else {
        res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'login' });
    }
});

router.get('/wallet.html', function(req, res) {
    if (req.session.userId) {
        res.render('wallet', { title: 'My wallet', name: req.session.name, logStatus: true, logMode: '' });
    } else {
        res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'login' });
    }
});

router.get('/signup', function(req, res) {
    console.log(req.body);
});

router.get('/logout', function(req, res) {
    delete req.session.userId;
    res.redirect('/');
});

router.post('/signup', userControllers.userRegister);
router.post('/login', userControllers.userLogin);
router.get('/me', userControllers.getMe);


module.exports = router;