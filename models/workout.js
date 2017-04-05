const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: 'exercise'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: String,
    description: String,
    pointsEarned: Number
});

WorkoutSchema.pre('save', function(next) {
    const Exercise = mongoose.model('exercise');
    Exercise.find({ _id: { $in: this.exercises } })
        .then(exercises => {
            const pointsEarned = exercises.reduce((init, curr) => {
                return curr.pointsEarned + init;
            }, 0);
            this.pointsEarned = pointsEarned;
            next();
        });
});

module.exports = mongoose.model('workout', WorkoutSchema);