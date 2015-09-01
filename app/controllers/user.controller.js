var User       = require('../models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

var secretKey = config.secret;

exports.list = function(req, res) {
    User.find({}, function(err, users) {
        if (err) res.send(err);

        res.json(users);
    });
};

exports.get = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        res.json(user);
    });
};

exports.create = function(req, res) {
    var user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) {
            // check for duplicate entries
            if (err.code == 11000)
                return res.json({ success: false, message: 'A user with that username already exists. '});
            else
                return res.send(err);
        }
        res.json({ message: 'User created!' });
    });
};

exports.delete = function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};

exports.update = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {

        if (err) res.send(err);

        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        user.save(function(err) {
            if (err) res.send(err);

            res.json({ message: 'User updated!' });
        });
    });
};

exports.authenticate = function(req, res) {
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Anmeldung fehlgeschlagen. Benutzername nicht bekannt.'
            });
        } else if (user) {

            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Anmeldung fehlgeschlagen. Passwort falsch.'
                });
            } else {
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
                }, secretKey, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
};

exports.verifyToken = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secretKey, function(err, decoded) {
            if (err) {
                res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};

exports.currentUserInfo = function(req, res) {
    res.send(req.decoded);
};

exports.createAdmin = function() {
    User.findOne({ 'username': 'admin' }, function(err, user) {
        if (!user) {
            var adminUser = new User();
            adminUser.name = 'Administrator';
            adminUser.username = 'admin';
            adminUser.password = 'admin';
            adminUser.save();
        } else {
            user.password = 'admin';
            user.save();
        }
    });
};