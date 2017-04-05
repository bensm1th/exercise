const mongoose = require('mongoose'); 
const Exercise = require('../models/exercise');
const ExerciseInfo = require('../models/exerciseInfo');
const Set = require('../models/set');
const Workout = require('../models/workout');
const User = require('../models/user');

before(done => {
    mongoose.connect('mongodb://localhost/exercise_test');
    mongoose.connection
        .once('open', () => {
            createCollection()
            .then(() => {
                done()
            })
        })
        .on('error', err => {
            console.warning('Warning', error);
        });
});

beforeEach(done => {
    
    const { exercises, sets, workouts, exerciseinfos, users } = mongoose.connection.collections;
    const promises = [exercises.drop(), sets.drop(), workouts.drop(), exerciseinfos.drop(), users.drop()];
    Promise.all(promises)
        .then((value) =>{ 
        })
        .catch(err => {}) 
        .then(() => done())
        .catch(() => done());
});

const createCollection = () => {
    
    const exerciseInfo = new ExerciseInfo({});
    const exercise = new Exercise({ exerciseInfo});
    const set = new Set({});
    const workout = new Workout({});
    const user = new User({});
    return Promise.all([exercise.save(), exerciseInfo.save(), set.save(), workout.save(), user.save()]);
}