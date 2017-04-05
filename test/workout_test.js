const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Set = require('../models/set');
const Exercise = require('../models/exercise');
const ExerciseInfo = require('../models/exerciseInfo');
const Workout = require('../models/workout');
const User = require('../models/user');

describe('Exercise: ', () => {
    let setOne, setTwo, exerciseInfoOne, exerciseOne, workoutOne, userOne;
    beforeEach(done => {
        const userOne = new User({
            firstName: 'Ben',
            lastName: 'Smith',
            age: 38,
            height: '189cm',
            weight: 220,
            points: 0,
            email: 'test@test.com',
            workouts: []
        });

        setOne = new Set({
            goals: {
                weight: 90,
                number: 10
            },
            actual: {
                weight: 80,
                number: 8
            }
        });

        setTwo = new Set({
            goals: {
                weight: 100,
                number: 12
            },
            actual: {
                weight: 90,
                number: 10
            }
        });
        exerciseInfoOne = new ExerciseInfo({
            name: 'TEST3',
            type: 'Strength',
            description: 'TEST3 TEST3 TEST3 TEST3 TEST3',
            points: 1
        });
       
        workoutOne = new Workout({ exercises: [], name: 'test', description: 'test'});
        exerciseOne = new Exercise({ sets: [], exerciseInfo: exerciseInfoOne});
        exerciseOne.sets.push.apply(exerciseOne.sets, [setOne, setTwo]);
        workoutOne.exercises.push(exerciseOne);
        workoutOne.user = userOne;
        userOne.workouts.push(workoutOne);
        Promise.all([exerciseOne.save(), setOne.save(), setTwo.save(), exerciseInfoOne.save(), workoutOne.save(), userOne.save()])
            .then(() => {
                done();
            })
    });

    it('GET to /workout shows existing workouts', done => {
        request(app)
            .get('/workout')
            .end((err, workout) => {
                assert(workoutOne._id.toString() === workout.body[0]._id);
                done();
            });
    });

    it('PUT to /workout/:id edits an existing workouts', done => {
        request(app)
            .put(`/workout/${workoutOne._id}`)
            .send({ name: 'changed' })
            .end(() => {
                Workout.findById(workoutOne._id)
                    .then(workout => {
                        assert(workout.name === 'changed');
                        done();
                    });
            });
    });

    it('PUT to /workout/:id edits an existing workout by adding a new exercise', done => {
        const exerciseInfoTwo = new ExerciseInfo({
            name: 'exerciseInfo2',
            type: 'exerciseinfo2',
            description: 'exerciseInfo2',
            points: 1
        });
        const exerciseTwo = new Exercise({
            exerciseInfo: exerciseInfoTwo
        });
        Promise.all([exerciseTwo.save(), exerciseInfoTwo.save()])
            .then(() => {
                request(app)
                    .put(`/workout/${workoutOne._id}?prop=exercises`)
                    .send({ exercises: exerciseTwo })
                    .end(() => {
                        Workout.findById(workoutOne._id)
                            .then(workout => {
                                assert(workout.exercises.length === 2);
                                done();
                            });
                    });
            });
    });

    it('DELETE to /workout/:id deletes an existing workouts', done => {
        done();
    });

    it('POST to /workout creates a new workout', done => {
        set1 = {
            goals: {
                weight: 10,
                number: 10
            },
            actual: {
                weight: 10,
                number: 8
            }
        };

        set2 = {
            goals: {
                weight: 15,
                number: 12
            },
            actual: {
                weight: 15,
                number: 10
            }
        };
        exerciseInfoOne = {
            name: 'TEST4',
            type: 'Strength',
            description: 'TEST3 TEST3 TEST3 TEST3 TEST3',
            points: 1
        };
        exercise1 = {
            sets: []
        }
        workout1 = {
            exercises: []
        }
        let set1saved, set2saved, exerciseInfoOneSaved, exercise1Saved;
        request(app)
            .post('/set')
            .send(set1)
            .end((err, result) => {
                set1saved = result.body;
                request(app)
                    .post('/set')
                    .send(set2)
                    .end((err, result) => {
                        set2saved = result.body;
                        request(app)
                            .post('/exerciseInfo')
                            .send(exerciseInfoOne)
                            .end((err, result) => {
                                exerciseInfoOneSaved = result.body;                                
                                exercise1.exerciseInfo = exerciseInfoOneSaved;
                                exercise1.sets.push.apply(exercise1.sets, [set1saved, set2saved]);
                                request(app)
                                    .post('/exercise')
                                    .send(exercise1)
                                    .end((err, result) => {
                                        exercise1Saved = result.body;
                                        workout1.exercises.push(exercise1Saved);
                                        request(app)
                                            .post('/workout')
                                            .send(workout1)
                                            .end((err, result) => {
                                                const newWorkout = result.body;
                                                assert(newWorkout.exercises[0].sets[0].goals.weight === 10);
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });
});