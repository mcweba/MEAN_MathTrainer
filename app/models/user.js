var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

var UserSchema   = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false },
    role: { type: String, required: 'Role is required', enum: ['admin', 'user'] }
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
    var user = this;

    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);