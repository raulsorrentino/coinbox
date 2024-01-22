const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const userRegister = (req, res, next) => {
    // looks for whether the entered email already exists in the database.
    User.findOne({ email: req.body.userId })
        .exec()
        .then((user) => {
            // if the entered email already exists then it returns error.
            // 409 -> request in conflict with server.
            if (user) {
                res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'signup' });
            } else {
                // else, it inserts the user's data into the database.
                // generates the hashed password with bcrypt and salt.
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    // if an error occurs during password generation.
                    // 500 -> internal server-side error.
                    if (err) {
                        res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'signup' });
                    } else {
                        // else, it creates a user model that it populates with data.
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.userId,
                            password: hash,
                            name: req.body.name,
                        });
                        // user is saved in the database.
                        user
                            .save()
                            .then(async(result) => {
                                await result
                                    .save()
                                    .then((result1) => {
                                        console.log(`User created ${result}`);
                                        req.session.userId = req.body.userId;
                                        req.session.name = req.body.name;
                                        res.redirect('/wallet');
                                    })
                                    // 400 -> the server cannot or will not process the request due to something that is perceived to be a client error
                                    .catch((err) => {
                                        console.log(err)
                                        res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'signup' });;
                                    });
                            })
                            // if an error occurs while saving the user to the db.
                            // 500 -> internal server-side error.
                            .catch((err) => {
                                console.log(err)
                                res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'signup' });;
                            });
                    }
                });
            }
        })
        // 500 -> internal server-side error.
        .catch((err) => {
            console.log(err)
            res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'signup' });;
        });
}


const userLogin = (req, res, next) => {
    // check if there is a user with that email
    User.findOne({ email: req.body.userId })
        .exec()
        .then((user) => {


            if (user == null) { // If it did not find the user.
                console.log('Auth failed: Email not found')
                res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'login' });
            } else {
                console.log(user)

                // otherwise compare the password entered with the password in the db.
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'login' });
                    }
                    if (result) {

                        console.log(user)

                        req.session.userId = user.email;
                        req.session.name = user.name;
                        res.redirect('/wallet');
                    }
                });
            }
        })
        .catch((err) => {
            res.render('wallet', { title: 'My wallet', name: '', logStatus: false, logMode: 'login' });
        });
}

const getMe = async(req, res) => {

    User.findOne({ email: req.session.userId })
        .exec()
        .then((user) => {

            if (user == null) {
                delete req.session.userId;
                res.redirect('/');
            } else {
                console.log(user);
                res.json(user);
            }
        })
        .catch((err) => {
            delete req.session.userId;
            res.redirect('/');
        });
};

module.exports = {
    userLogin,
    userRegister,
    getMe,
};