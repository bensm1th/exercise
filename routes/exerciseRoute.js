const ExerciseController = require('../controllers/exercise');

module.exports = (app) => {
    app.get('/exercise', ExerciseController.show);
    app.post('/exercise', ExerciseController.create);
    app.put('/exercise/:id', ExerciseController.edit);
    app.delete('/exercise/:id', ExerciseController.delete);
}