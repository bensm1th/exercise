const CustomController = require('../controllers/custom');

module.exports = (app) => {
    app.post('/createworkout', CustomController.createWorkout);
    app.post('/createworkout/update', CustomController.updateWorkout);
}