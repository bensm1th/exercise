const Exercise = require('../models/exercise');
const Set = require('../models/set');
const ExerciseInfo = require('../models/exerciseInfo');
const Workout = require('../models/workout');

module.exports = {
    createWorkout(req, res, next) {
        const { createForm: { name, description }, exercises } = req.body;
        const finished = exercises.length;
        let iterations = 0;
        const createWorkoutRoutine = (exercises) => {
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
                                    Workout.create({ name, description, exercises: exerciseIds })
                                        .then(workout =>{ 
                                            console.log('--------workout--------');
                                            console.log(workout);
                                            res.send(workout)})
                                        .catch(next);
                                }
                            });
                    })
            });
        }
        createWorkoutRoutine(exercises);
    }
}