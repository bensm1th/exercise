const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Set = require('../models/set');
const Exercise = require('../models/exercise');
const ExerciseInfo = require('../models/exerciseInfo');

describe('Exercise: ', () => {

    it('GET to /exerciseInfo shows existing exerciseInfos', done => {
        const exerciseInfo1 = new ExerciseInfo({
            name: 'Biceps curl',
            type: 'Strength',
            description: 'TEST TEST TEST TEST TEST',
            points: 1
        });
        exerciseInfo1.save()
            .then(exerciseInfo => {
                request(app)
                    .get('/exerciseInfo')
                    .end((err, result) => {
                        assert(result.body[0]._id === exerciseInfo._id.toString());
                        done();
                    });
            });
    });

    it('POST to /exerciseInfo creates a new exerciseInfos', done => {
        const exerciseInfo1 = {
            name: 'Biceps curl',
            type: 'Strength',
            description: 'TEST2 TEST2 TEST2 TEST2 TEST2',
            points: 1
        };
        request(app)
            .post('/exerciseInfo')
            .send(exerciseInfo1)
            .end((err, result) => {
                assert(result.body.name === exerciseInfo1.name);
                done();
            });
    });

    it('PUT to /exerciseInfo/:id edits an existing exerciseInfos', done => {
        const exerciseInfo = new ExerciseInfo({
            name: 'TEST3',
            type: 'Strength',
            description: 'TEST3 TEST3 TEST3 TEST3 TEST3',
            points: 1
        });
        exerciseInfo.save()
            .then(exerciseInfo => {
                request(app)
                .put(`/exerciseInfo/${exerciseInfo._id}`)
                .send({ name: 'TEST4'})
                .end(() => {
                    ExerciseInfo.findById(exerciseInfo._id)
                        .then(result => {
                            assert(result.name === 'TEST4');
                            done();
                        });
                });
            });
    });

    it('DELETE to /exerciseInfo/:id deletes an existing exerciseInfos', done => {
          const exerciseInfo = new ExerciseInfo({
            name: 'TEST3',
            type: 'Strength',
            description: 'TEST3 TEST3 TEST3 TEST3 TEST3',
            points: 1
            });
            exerciseInfo.save()
                .then(exerciseInfo => {
                    request(app)
                        .delete(`/exerciseInfo/${exerciseInfo._id}`)
                        .end(() => {
                            ExerciseInfo.findById(exerciseInfo._id)
                            .then(result => {
                                assert(result === null);
                                done();
                            });
                        });
                });
    });
});
