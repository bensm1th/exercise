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
});

SetSchema.virtual('reward')
    .get(function() {
        const weightsMet = this.actual.weight >= this.goals.weight;
        const setsMet = this.actual.number >= this.goals.number;
        if (weightsMet && setsMet) {
            return true;
        }
        return false;
    });

module.exports = mongoose.model('set', SetSchema);