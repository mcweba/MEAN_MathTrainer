var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CalculationSolveSchema  = new Schema({
    calculation: {
        type: Schema.ObjectId,
        ref: 'Calculation'
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    calcAsString: {
        type: String,
        required: 'CalcAsString is required'
    },
    providedRes: {
        type: Number,
        required: 'Provided result is required'
    },
    duration: {
        type: Number,
        required: 'Duration is required'
    },
    correct: {
        type: Boolean,
        required: 'Correct is required'
    }
});

module.exports = mongoose.model('CalculationSolve', CalculationSolveSchema);