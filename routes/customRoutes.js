const CustomController = require('../controllers/custom');

module.exports = (app) => {
    app.post('/createworkout', CustomController.createWorkout);
}