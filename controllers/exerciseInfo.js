const ExerciseInfo = require('../models/exerciseInfo');
const Exercise = require('../models/exercise');
const Workout = require('../models/workout');
const User = require('../models/user');

module.exports = {
    
    show(req, res, next) {
        const { id } = req.query;
        User.findOne({ id: id })
            .then(user => {
                ExerciseInfo.find({ user: user._id })
                    .then(exerciseInfo => {
                        return res.send(exerciseInfo);
                    });
            })
            .catch(next);
    },

    create(req, res, next) {
        const exerciseInfoProps = req.body;
        const { prop, id } = req.query;
        if (prop === 'exercises') {
            ExerciseInfo.find({ '_id': { $in: exerciseInfoProps }})
                .then(exerciseInfos => {
                    return res.send(exerciseInfos);
                })
                .catch(next);
        }
        else {
            User.findOne({ id: id })
                .then(user => {
                    exerciseInfoProps.user = user._id;
                    const exerciseInfo = new ExerciseInfo(exerciseInfoProps);
                    exerciseInfo.save()
                        .then(_exerciseInfo => { 
                            console.log('--saved exercise --');
                            console.log(_exerciseInfo);
                            res.send(_exerciseInfo);
                        });
                })
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
        ExerciseInfo.findOneAndUpdate({ _id: exerciseInfoId }, { valid: false } )
            .then(exerciseInfo => {
                res.send(exerciseInfo);
            })
            .catch(next);
    }
}