const Set = require('../models/set');

module.exports = {
    show(req, res, next) {
        Set.find({})
            .then(sets => res.send(sets))
            .catch(next);
    },

    create(req, res, next) {
        const setProps = req.body;
        Set.create(setProps)
            .then(set => res.send(set))
            .catch(next);
    },

    edit(req, res, next) {
        const setProps = req.body;
        const setId = req.params.id;
        Set.findByIdAndUpdate(setId, setProps, { new: true})
            .then(set => res.send(set))
            .catch(next);
    },

    delete(req, res, next) {
        const setId = req.params.id;
        Set.findByIdAndRemove(setId)
            .then(set => res.send(set))
            .catch(next);
    }
}