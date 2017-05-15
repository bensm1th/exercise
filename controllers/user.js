const User = require('../models/user');
const Workout = require('../models/workout');

module.exports = {
    show(req, res, next) {
        User.find({})
            .then(users => {
                res.send(users);
            })
            .catch(next);
    },

    getById(req, res, next) {
        User.findOne({ id: req.params.id })
            .then(user => {
                res.send(user);
            })
            .catch(next);
    },

    create(req, res, next) {
        const userProps = req.body;
        const { id } = userProps;
        User.findOne({ id: id })
            .then(user => {
                if (user) {
                    return res.send(user);
                } else {
                    const newUser = new User(userProps);
                    newUser.save()
                        .then(savedUser => res.send(savedUser))
                }
            })
            .catch(next);
    },

    edit(req, res, next) {
        const userId = req.params.id;
        const userProps = req.body;
        User.findByIdAndUpdate(userId, userProps)
            .then(() => {
                User.findById(userId)
                    .then(user => {
                        res.send(user);
                    });
            })
            .catch(next);
    },

    delete(req, res, next) {
        const userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(user => {
                res.send(user);
            })
            .catch(next);
    }
}
