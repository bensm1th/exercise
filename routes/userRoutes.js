const UserController = require('../controllers/user');

module.exports = (app) => {
    app.get('/user', UserController.show);
    app.get('/user/:id', UserController.getById);
    app.post('/user', UserController.create);
    app.put('/user/:id', UserController.edit);
    app.delete('/user/:id', UserController.delete);
}