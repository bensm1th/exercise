const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseInfoSchema = new Schema({
    name: String,
    type: String,
    description: String,
    points: {
        type: Number,
        default: 1
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    valid: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('exerciseInfo', ExerciseInfoSchema);



