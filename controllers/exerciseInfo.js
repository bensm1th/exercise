const ExerciseInfo = require('../models/exerciseInfo');

module.exports = {
    show(req, res, next) {
        ExerciseInfo.find({})
            .then(exerciseInfo => {
                return res.send(exerciseInfo)
            })
            .catch(next);
    },

    create(req, res, next) {
        const exerciseInfoProps = req.body;
        const { prop } = req.query;
        if (prop === 'exercises') {
            ExerciseInfo.find({ '_id': { $in: exerciseInfoProps }})
                .then(exerciseInfos => {
                    return res.send(exerciseInfos);
                })
                .catch(next);
        }
        else {
            ExerciseInfo.create(exerciseInfoProps)
                .then(exerciseInfo => res.send(exerciseInfo))
                .catch(next);
        }
    },

    edit(req, res, next) {
        const exerciseInfoProps = req.body;
        const exerciseInfoId = req.params.id;
        ExerciseInfo.findByIdAndUpdate(exerciseInfoId, exerciseInfoProps, { new: true })
            .then(exerciseInfo => res.send(exerciseInfo))
            .catch(next);
    },

    delete(req, res, next) {
        const exerciseInfoId = req.params.id;
        ExerciseInfo.findByIdAndRemove(exerciseInfoId)
            .then(result => {
                res.send(result);
            })
            .catch(next);
    }
}