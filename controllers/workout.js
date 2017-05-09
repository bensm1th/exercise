const Exercise = require('../models/exercise');
const Set = require('../models/set');
const ExerciseInfo = require('../models/exerciseInfo');
const Workout = require('../models/workout');
const User = require('../models/user');

module.exports = {
    show(req, res, next) {
        const { id } = req.query;
        User.findOne({ id: id })
            .then(user => {
            Workout.find({ user: user._id })
                .populate({
                    path: 'exercises',
                    populate: {
                        path: 'exerciseInfo sets'
                    }
                })
                .then(workouts => {
                    res.send(workouts);
                })
        })
        .catch(next);
    },

    create(req, res, next) {
        const workoutProps = req.body;   
        const workout = new Workout(workoutProps);
        const { id } = req.query;
        User.findOne({ id: id })
            .then(user => {
                workout.user = user._id;
                workout.save()
                    .then(workout => {
                        Workout.findById(workout._id)
                            .populate({
                                path: 'exercises user',
                                populate: {
                                    path: 'exerciseInfo sets'
                                }
                            })
                            .then(foundWorkout => {
                                res.send(foundWorkout);
                            });
                    });
            })
            .catch(next);             
    },

    edit(req, res, next) {
        const workoutId = req.params.id;
        const workoutProps = req.body;
        const prop = req.query.prop;
      
        if (prop === 'exercises') {
            Workout.findByIdAndUpdate(workoutId, { $push: { 'exercises': workoutProps.exercises }}, { new: true })
                .then(() => {
                    Workout.findById(workoutId)
                        .populate({
                            path: 'user exercises',
                                populate: {
                                    path: 'exerciseInfo',
                                    model: 'exerciseInfo',
                                },
                                populate: {
                                    path: 'sets',
                                    model: 'set'
                                }
                        })
                        .then(workout => {
                            res.send(workout);
                        });
                })
                .catch(next);
        }
        else {
            Workout.findByIdAndUpdate(workoutId, workoutProps, { new: true })
                .then(() => {
                    Workout.findById(workoutId)
                        .populate({
                            path: 'user exercises',
                                populate: {
                                    path: 'exerciseInfo',
                                    model: 'exerciseInfo',
                                },
                                populate: {
                                    path: 'sets',
                                    model: 'set'
                                }
                        })
                        .then(workout => {
                            res.send(workout);
                        });
                })
                .catch(next);
        }        
    },

    delete(req, res, next) {
        const workoutId = req.params.id;
        Workout.findByIdAndRemove(workoutId)
            .then(workout => {
                res.send(workout);
            })
            .catch(next);
    }
}

const createHelper = (props) => {
    return  props.exercises.reduce((a, b) => {
        let object = {};
        const reducedSets = b.sets.reduce((init, curr) => {
            const newSet = new Set(curr);
            init.push(newSet);
            return init;
        }, []);
        object.sets = reducedSets;
        const newExerciseInfo = new ExerciseInfo(b.exerciseInfo);
        object.exerciseInfo = newExerciseInfo;
        a.push(object);
        return a;
    }, []);
}