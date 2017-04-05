const UserController = require('../controllers/user');

module.exports = (app) => {
    app.get('/user', UserController.show);
    app.post('/user', UserController.create);
    app.put('/user/:id', UserController.edit);
    app.delete('/user/:id', UserController.delete);
}