var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CalculationSetSchema  = new Schema({
	name: {type: String},
	created: {
		type: Date,
		default: Date.now
	},
    creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    diff_level: {
        type: Number,
        required: 'diff level is required'
    },
	active: {
		type: Boolean,
		required: 'Active is required'
	},
    calculations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Calculation'}]
});

module.exports = mongoose.model('CalculationSet', CalculationSetSchema);