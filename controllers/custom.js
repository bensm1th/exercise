const Exercise = require('../models/exercise');
const Set = require('../models/set');
const ExerciseInfo = require('../models/exerciseInfo');
const Workout = require('../models/workout');
const User = require('../models/user');

module.exports = {
    updateWorkout(req, res, next) {
        const workoutProps = req.body;
        const finished = workoutProps.exercises.length;
        let iterations = 0;
        delete workoutProps._id;
        workoutProps.finished = true;
        const updateWorkoutRoutine = (props) => {
            const { exercises } = props;
            let exerciseIds = [];
            exercises.map(exercise => {
                delete exercise._id;
                const sets = exercise.sets.map(set => {
                    delete set._id;
                    return set;
                });
                exercise.sets = [];
                Set.insertMany(sets)
                    .then(result => {
                        result.forEach(set => {
                            exercise.sets.push(set._id);
                        });
                        Exercise.create(exercise)
                            .then(newExercise => {
                                iterations += 1;
                                exerciseIds.push(newExercise);
                                if (iterations === finished) {
                                    workout = Object.assign({}, workoutProps, { exercises: exerciseIds });
                                    delete workout.createdAt
                                    delete workout.updatedAt
                                    Workout.create(workout)
                                        .then(newWorkout => {
                                            Workout.findOne({ _id: newWorkout._id})
                                                .populate({
                                                    path: 'user exercises',
                                                    populate: {
                                                        path: 'exerciseInfo sets',
                                                    }
                                                })
                                            .then(_workout => {
                                                res.send(_workout);
                                            })
                                        })
                                        .catch(next);
                                }
                            });
                    });
            });
        };
        updateWorkoutRoutine(workoutProps);
    },
    createWorkout(req, res, next) {
        const { createForm: { name, description }, exercises } = req.body;
        const { id } = req.query;
        const finished = exercises.length;
        let iterations = 0;
        const createWorkoutRoutine = (exercises, userId) => {
            let exerciseIds = [];
            exercises.map(exercise => {
                delete exercise.setsVisibility;
                delete exercise.setsSaved;
                let sets = [];
                exercise.sets.map(set => {
                    let setObj = {};
                    setObj.goals = {
                        weight: set.weight,
                        number: set.reps,
                    }
                    sets.push(setObj);
                });
                exercise.sets = [];
                Set.insertMany(sets)
                    .then(result => {
                        result.forEach(set => {
                            exercise.sets.push(set._id);
                        });
                        Exercise.create(exercise)
                            .then(newExercise => {
                                iterations += 1;
                                exerciseIds.push(newExercise._id);
                                if (iterations === finished) {
                                    Workout.create({ name, description, exercises: exerciseIds, user: userId })
                                        .then(workout =>{ 
                                            res.send(workout)})
                                        .catch(next);
                                }
                            });
                    })
            });
        }
        User.findOne({ id: id })
            .then(user => {
                createWorkoutRoutine(exercises, user._id);
            });
    }
}