const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Set = require('../models/set');
const Exercise = require('../models/exercise');
const ExerciseInfo = require('../models/exerciseInfo');
const Workout = require('../models/workout');
const User = require('../models/user');

describe('User: ', () => {
    let user;
    beforeEach(done => {
        const user1 = {
            firstName: 'Ben',
            lastName: 'Smith',
            age: 38,
            height: '189cm',
            weight: 220,
            points: 0,
            email: 'test@test.com'
        }
        
        user = new User(user1);
        user.save()
            .then(result => {
                done();
            });
    });
    it('GET to /user shows all existing users', done => {
        request(app)
            .get('/user')
            .end((err, result) => {
                const returnedUser = result.body;
                assert(returnedUser[0].firstName === 'Ben');
                done();
            });
    });

    it('POST to /user can create a new user', done => {
        const user2 = {
            firstName: 'Ken',
            lastName: 'Potter',
            age: 28,
            height: '159cm',
            weight: 120,
            points: 0,
            email: 'test1@test.com'
        }
        request(app)
            .post('/user')
            .send(user2)
            .end((err, result) => {
                User.findById(result.body._id)
                    .then(user => {
                        assert(user.firstName === 'Ken');
                        done();
                    });
            });
    });

    it('PUT to /user/:id can edit an existing user', done => {
        request(app)
            .put(`/user/${user._id}`)
            .send({ firstName: 'Bobby'})
            .end((err, result) => {
                const updatedUser = result.body;
                assert(updatedUser.firstName === 'Bobby');
                done();
            });
    });

    it('DELETE to /user/:id can delete an existing user', done => {
        request(app)
            .delete(`/user/${user._id}`)
            .end(() => {
                User.findById(user._id)
                    .then(user => {
                        assert(user === null);
                        done();
                    });
            });
    });
});
