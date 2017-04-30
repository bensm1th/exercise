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
            
            const weightRewards = sets.filter(set => {
                return set.weightReward;
            }).length;
            const setRewards = sets.filter(set => {
                return set.numberReward;
            }).length;
            
            const pointsPerReward = this.exerciseInfo.points ? this.exerciseInfo.points : 1;
            const pointsEarned = (setRewards + weightRewards) * pointsPerReward;
            this.pointsEarned = pointsEarned;
            next();
        });
});

module.exports = mongoose.model('exercise', ExerciseSchema);
