const WorkoutController = require('../controllers/workout');

module.exports = (app) => {
    app.get('/workout', WorkoutController.show);
    app.post('/workout', WorkoutController.create);
    app.put('/workout/:id', WorkoutController.edit);
    app.delete('/workout/:id', WorkoutController.delete);
}