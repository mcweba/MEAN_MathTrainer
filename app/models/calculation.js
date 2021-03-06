var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CalculationSchema  = new Schema({
    number1: {
        type: Number,
        required: 'Number 1 is required'
    },
    operator: {
        type: String,
        required: 'Operator is required',
        enum: ['+', '-', '*', '/']
    },
    number2: {
        type: Number,
        required: 'Number 2 is required'
    },
    result: {
        type: Number,
        required: 'Result is required'
    }
});

CalculationSchema.index({number1: 1, number2: 1, operator: 1});

module.exports = mongoose.model('Calculation', CalculationSchema);