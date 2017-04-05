const ExerciseInfoController = require('../controllers/exerciseInfo');

module.exports = (app) => {
    app.get('/exerciseInfo', ExerciseInfoController.show);
    app.post('/exerciseInfo', ExerciseInfoController.create);
    app.put('/exerciseInfo/:id', ExerciseInfoController.edit);
    app.delete('/exerciseInfo/:id', ExerciseInfoController.delete);
}