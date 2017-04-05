const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exerciseRoutes = require('./routes/exerciseRoute');
const setRoutes = require('./routes/setRoutes');
const exerciseInfoRoutes = require('./routes/exerciseInfoRoute');
const workoutRoutes = require('./routes/workoutRoute');
const userRoutes = require('./routes/userRoutes');
const app = express();

mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/exercise');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

exerciseInfoRoutes(app);
exerciseRoutes(app);
setRoutes(app);
workoutRoutes(app);
userRoutes(app);

app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message })
});

app.listen(3000, () => {
    console.log('exercise app listening on port 3000');
});

module.exports = app;