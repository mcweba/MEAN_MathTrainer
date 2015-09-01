var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CalculationSchema  = new Schema({
    number1: {
        type: Number,
        required: 'Operand is required'
    },
    operator: {
        type: String,
        required: 'Operator is required',
        enum: ['+', '-', '*', '/']
    },
    number2: {
        type: Number,
        required: 'Operand is required'
    },
    result: {
        type: Number,
        required: 'Result is required'
    }
});

module.exports = mongoose.model('Calculation', CalculationSchema);