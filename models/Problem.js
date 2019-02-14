const mongoose = require('mongoose');

var ProblemSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    title: {type: String, required: true},
    solution_count: {type: Number, required: true},
    difficulty_level: {type: Number, required: true, min: 1, max: 3},
    description: {type: String, required: true},
    tests: {type: Array, required: true}
});

module.exports = mongoose.model('Problem', ProblemSchema);

// An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.
