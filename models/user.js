const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    age: Number,
    height: String,
    weight: Number,
    points: {
        type: Number,
        default: 0
    },
    email: String,
    workouts: [{
        type: Schema.Types.ObjectId,
        ref: 'workout'
    }]
});

module.exports = mongoose.model('user', UserSchema);