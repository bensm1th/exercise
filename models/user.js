const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    age: Number,
    height: String,
    password: String,
    weight: Number,
    points: {
        type: Number,
        default: 0
    },
    workouts: [{
        type: Schema.Types.ObjectId,
        ref: 'workout'
    }],
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true
    }
});

// on save hook, encrypt password
// before saving a model, run this function
UserSchema.pre('save', function(next) {
    //get access to the user model
    const user = this;

    //generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        // hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }

            //overwrite plaintext password with encrypted password
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    })
}


module.exports = mongoose.model('user', UserSchema);