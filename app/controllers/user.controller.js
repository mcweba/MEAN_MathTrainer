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
    user.username = req.body.username.toLowerCase();
    user.password = req.body.password;
    user.role = req.body.role;

    user.save(function(err) {
        if (err) {
            // check for duplicate entries
            if (err.code == 11000)
                return res.json({ success: false, message: 'Ein Benutzer mit diesem Benutzernamen existiert bereits'});
            else
                return res.send(err);
        }
        res.json({ message: 'User successfully created' });
    });
};

exports.delete = function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err) res.send(err);

        res.json({ message: 'User successfully deleted' });
    });
};

exports.update = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {

        if (err) res.send(err);

        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username.toLowerCase();
        if (req.body.password) user.password = req.body.password;
        if (req.body.role) user.role = req.body.role;

        user.save(function(err) {
            if (err) res.send(err);

            res.json({ message: 'User successfully modified' });
        });
    });
};

exports.authenticate = function(req, res) {
    var username = req.body.username;
    if(username){
        username = username.toLowerCase();
    }
    User.findOne({username: username})
        .select('name username password role').exec(function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Login failed. Username unknown'
            });
        } else if (user) {

            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Login failed. Password wrong'
                });
            } else {
                var token = jwt.sign({
                    name: user.name,
                    userId: user._id,
                    role: user.role
                }, secretKey, {
                    expiresInMinutes: 1440 // expires after 24 hours
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
                    message: 'Failed to authenticate the token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'No token has been provided'
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
            adminUser.role = 'admin';
            adminUser.save();
        } else {
            user.password = 'admin';
            user.role = 'admin';
            user.save();
        }
    });
};