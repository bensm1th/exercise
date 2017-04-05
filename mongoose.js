const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/docs');
mongoose.Promise = global.Promise;

const TestSchema = new Schema({
    name: String,
    age: Number
});

const Test = mongoose.model('test', TestSchema);
const { tests } = mongoose.connection.collections;
tests.drop();

let test = new Test({
    name: 'Ben'
});

console.log('test instance before any changes');
console.log(test);
console.log(' ');


console.log("check 'isNew' of test before it is saved to db");
console.log(test.isNew);
console.log(' ');
test.save()
    .then((test) => {
        console.log("check 'isNew' of test after it is saved to db");
        console.log(test.isNew);
        console.log(' ');
        callback(test._id);
    });

const callback = (_id) => {
    Test.update({ _id }, { $set: { age: 38 } })
        .then(() => {
            Test.find({}).then(tests => console.log(tests));
        });
}









