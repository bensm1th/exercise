const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Set = require('../models/set');
const Exercise = require('../models/exercise');
const ExerciseInfo = require('../models/exerciseInfo');

describe('Exercise: ', () => {
    let setOne, setTwo, exerciseOne, exerciseInfo;

    beforeEach(done => {
        setOne = new Set({
            goals: {
                weight: 90,
                number: 10
            },
            actual: {
                weight: 80,
                number: 10
            }
        });

        setTwo = new Set({
            goals: {
                weight: 100,
                number: 12
            },
            actual: {
                weight: 90,
                number: 12
            }
        });
        exerciseInfo = new ExerciseInfo({
            name: 'TEST3',
            type: 'Strength',
            description: 'TEST3 TEST3 TEST3 TEST3 TEST3',
            points: 1
        });
        exerciseOne = new Exercise({ sets: [], exerciseInfo });
        //exerciseOne.exerciseInfo = exerciseInfo;
        exerciseOne.sets.push.apply(exerciseOne.sets, [setOne, setTwo]);
        Promise.all([exerciseOne.save(), setOne.save(), setTwo.save(), exerciseInfo.save()])
            .then(() => {
                done();
            })
    });

    it('can populate an existing exercise graph', done => {
        Exercise.findOne({ _id: exerciseOne._id})
            .populate('sets exerciseInfo')
            .then(exercise => {
                console.log(exercise);
                done();
            });
    });

    it('can populate a full existing exercise graph', done => {
        Exercise.findOne({ _id: exerciseOne._id})
            .populate('exerciseInfo sets')
            .then(exercise => {
                assert(exercise.sets[0].actual.weight === 80);
                assert(exercise.exerciseInfo.name === 'TEST3');
                done();
            });
    });

    it('can populate a full existing relation graph, then update, then save', done => {
        Exercise.findOne({ _id: exerciseOne._id })
            .populate('exerciseInfo sets')
            .then(exercise => {
                Set.findByIdAndUpdate(exercise.sets[0]._id, { 'actual.weight': 75 })
                    .then((result) => {
                        Exercise.findOne({ _id: exerciseOne._id})
                            .populate('exerciseInfo sets')
                            .then(exercise => {
                                assert(exercise.sets[0].actual.weight === 75)
                                done();
                            });
                    });
            })
            .catch(err => console.log(`populate error is: ${err}`))
    });

    it('GET to /exercise shows existing exercises', done => {
        request(app)
            .get('/exercise')
            .end((err, result) => {
                assert(result.body[0]._id === exerciseOne._id.toString());
                done();
            });
    });

    it('POST to /exercise creates a new exercise', done => {
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
        let set1saved, set2saved, exerciseInfoOneSaved;
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
                                    .end(() => {
                                        Exercise.find({})
                                            .then(exercises => {
                                                assert(exercises.length === 2);
                                                done();
                                            });
                                    });
                            });
                    });
                
            });
    });


    it('PUT to /exercise/:id edits an existing exercise in the child doc', done => {
        const id = exerciseInfo._id.toString();
        request(app)
            .put(`/exercise/${exerciseOne._id}?subdoc=exerciseInfo&id=${id}`)
            .send({ 'name': 'TEST1' })
            .end(() => {
                //pull of the document and look for the change
                Exercise.findOne({})
                    .populate('exerciseInfo')
                    .then((exercise) => {
                        assert(exercise.exerciseInfo.name === 'TEST1');
                        done();
                    });
            });
    });

    it('PUT to /exercise/:id edits an existing exercise in the sets array child doc', done => {
        const id = setOne._id.toString();
        request(app)
            .put(`/exercise/${exerciseOne._id}?subdoc=sets&id=${id}`)
            .send({ 'actual.weight': 70 })
            .end(() => {
                Exercise.findOne({ _id: exerciseOne._id })
                    .populate('sets')
                    .then(exercise => {
                        assert(exercise.sets[0].actual.weight === 70);
                        done();
                    });
            });
    });

    it('can edit an existing exercise in the child doc', done => {
        Exercise.findById(exerciseOne._id)
            .populate('exerciseInfo')
            .then(exercise => {
                ExerciseInfo.findByIdAndUpdate(exercise.exerciseInfo._id, { name: 'changed' })
                    .then(result => {
                        Exercise.findById(exerciseOne._id)
                            .populate('exerciseInfo')
                            .then(data => {
                                assert(data.exerciseInfo.name === 'changed');
                                done();
                            });
                    });
            });
    });

    it('DELETE to /exercise/:id deletes an existing exercise', done => {
        request(app)
            .delete(`/exercise/${exerciseOne._id}`)
            .end(() => {
                Exercise.findById(exerciseOne._id)
                    .then(deletedExercise => {
                        assert(deletedExercise === null);
                        done();
                    });
            });
    });
});
