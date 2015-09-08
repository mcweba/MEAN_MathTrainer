var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CalculationSetSolveSchema  = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
    creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	calculationset: {
		type: Schema.ObjectId,
		ref: 'CalculationSet'
	},
    score: {
        type: Number,
        required: 'score is required'
    },
	duration: {
		type: Number,
		required: 'duration is required'
	},
    calculationsolves: [{type: mongoose.Schema.Types.ObjectId, ref: 'CalculationSolve'}]
});

module.exports = mongoose.model('CalculationSetSolve', CalculationSetSolveSchema);