const SetController = require('../controllers/set');

module.exports = (app) => {
    app.get('/set', SetController.show);
    app.post('/set', SetController.create);
    app.put('/set/:id', SetController.edit);
    app.put('/set', SetController.editMultiple);
    app.delete('/set/:id', SetController.delete);
}