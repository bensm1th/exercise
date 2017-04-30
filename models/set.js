const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetSchema = new Schema({
    goals: {
        weight: Number,
        number: Number
    },
    actual: {
        weight: Number,
        number: Number
    },
    //_id: String
});

SetSchema.virtual('weightReward')
    .get(function() {
        if (this.goals.weight === this.actual.weight) {
            return true;
        }
        return false;
    })
    .set(function() {

    });

SetSchema.virtual('numberReward')
    .get(function() {
        if(this.goals.number === this.actual.number) {
            return true;
        }
        return false;
    });

module.exports = mongoose.model('set', SetSchema);