const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseInfoSchema = new Schema({
    name: String,
    type: String,
    description: String,
    points: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('exerciseInfo', ExerciseInfoSchema);



