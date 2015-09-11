var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CalculationSetInfoSchema  = new Schema({
    creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	calculationset: {
		type: Schema.ObjectId,
		ref: 'CalculationSet'
	},
    lastscore: {
        type: Number,
        required: 'last score is required'
    },
    lastduration: {
        type: Number,
        required: 'last duration is required'
    },    
	lastsolve: {
		type: Date,
		required: 'last solve is required'
	}
});

module.exports = mongoose.model('CalculationSetInfo', CalculationSetInfoSchema);