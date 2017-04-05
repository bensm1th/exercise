const Exercise = require('../models/exercise');
const Set = require('../models/set');
const ExerciseInfo = require('../models/exerciseInfo');

module.exports = {
    show(req, res, next) {
        Exercise.find({})
            .populate('exerciseInfo sets')
            .then(exercises => {
                res.send(exercises)
            })
            .catch(next);
    },

    create(req, res, next) {
        const exerciseProps = req.body;
        const exercise = new Exercise(exerciseProps);
        exercise.save()
            .then(exercise => {
                Exercise.findById(exercise._id)
                    .populate('exerciseInfo sets')
                    .then(result => {
                        res.send(result);
                    });
            })
            .catch(next);
    },

    edit(req, res, next) {
        const exerciseId = req.params.id;
        const exerciseProps = req.body;
        const { subdoc, id, prop } = req.query;
        const Subdoc = subdoc === 'exerciseInfo' ? ExerciseInfo : Set;
        
        if(subdoc) {
            Subdoc.findByIdAndUpdate(id, exerciseProps)
                .then(() => {
                    Exercise.findById(exerciseId)
                        .populate('exerciseInfo sets')
                        .then(data => {
                            res.send(data);
                        });
                })
            .catch(next);   
    } else {
        const massagedProps = prop === "sets" ? { $push: { 'sets': exerciseProps.sets } } : exerciseProps;
        Exercise.findByIdAndUpdate(exerciseId, massagedProps, { new: true })
            .then(exercise => {
                Exercise.findById(exerciseId)
                    .populate('exerciseInfo sets')
                    .then(data => {
                        res.send(data);
                    });
            })
            .catch(next);
    }
},

    delete(req, res, next) {
        const exerciseId = req.params.id;
        Exercise.findByIdAndRemove(exerciseId)
            .then(exercise => res.send(exercise))
            .catch(next);
    }
}
