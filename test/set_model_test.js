const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Set = require('../models/set');

describe('Set', () => {
    it('can create a set', done => {
        Set.create({
            goals: {
                weight: 100,
                number: 12
            },
            actual: {
                weight: 100,
                number: 12
            }
        })
            .then((set) => {
                console.log(`sets reward: ${set.weightReward}`);
                console.log(`reps reward: ${set.numberReward}`)
                assert(set.goals.weight === 100);
                done();
            });
    });

    it('POST to /set creates a new set', done => {
        const set = {
            goals: {
                weight: 100,
                number: 12
            },
            actual: {
                weight: 90,
                number: 10
            }
        }
        Set.count()
        .then(count => {
            request(app)
            .post('/set')
            .send(set)
            .end(() => {
                Set.count()
                    .then((newCount) => {
                        assert(count + 1 === newCount);
                        done();
                });
            });
        });
    });

    it('PUT to /set/:id edits an existing set', done => {
        const editedSet = {
            goals: {
                weight: 90,
                number: 10
            },
            actual: {
                weight: 80,
                number: 8
            }
        };

        Set.create({
            goals: {
                weight: 100,
                number: 12
            },
            actual: {
                weight: 90,
                number: 10
            }
        })
        .then(set => {
            request(app)
            .put(`/set/${set._id}`)
            .send(editedSet)
            .end(() => {
                Set.find({})
                .then(updatedSet => {
                    assert(updatedSet[0].goals.weight === 90);
                    done();
                });
            });
        });
    });

    it('DELETE to /set/:id deletes an existing set', done => {
        const set = new Set({
            goals: {
                weight: 90,
                number: 10
            },
            actual: {
                weight: 80,
                number: 8
            }
        });
        set.save()
            .then(set => {
                request(app)
                .delete(`/set/${set._id}`)
                .end(() => {
                    Set.findById(set._id)
                    .then(result => {
                        assert(result === null);
                        done();
                    });
                });
            });
    });
});