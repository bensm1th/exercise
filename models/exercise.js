const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    sets: [{
        type: Schema.Types.ObjectId,
        ref: 'set'
    }],
    exerciseInfo: {
        type: Schema.Types.ObjectId,
        ref: 'exerciseInfo',
        required: true
    },
    pointsEarned: {
        type: Number,
        default: 0
    }
});

ExerciseSchema.virtual('setsNumber')
    .get(function() {
        return this.sets.length;
    });

ExerciseSchema.pre('save', function(next) {
    const Set = mongoose.model('set');
    Set.find({ _id: { $in: this.sets }})
        .then(sets => {
            const rewardsMet = sets.reduce((init, set) => {
                if (set.reward) {
                    return init + 1;
                }
                return init;
            }, 0);
            const ExerciseInfo = mongoose.model('exerciseInfo');
            ExerciseInfo.findOne({ _id: this.exerciseInfo})
                .then(_exerciseInfo => {
                    const pointsPerReward = _exerciseInfo.points;
                    const pointsEarned = (rewardsMet) * pointsPerReward;
                    this.pointsEarned = pointsEarned;
                    next();
                })
                .catch(next);
        });
});

module.exports = mongoose.model('exercise', ExerciseSchema);
