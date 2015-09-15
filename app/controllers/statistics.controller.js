var CalculationSolve = require('../models/calculationsolve');
var CalculationSetSolve = require('../models/calculationsetsolve');

exports.list = function(req, res) {
    CalculationSetSolve.find({}).select('-calculationset -calculationsolves').populate('creator', 'name').exec(function(err, calcsetsolves) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
            return;
        }
        res.json(calcsetsolves);
    });
};