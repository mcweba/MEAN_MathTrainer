var CalculationSolve = require('../models/calculationsolve');
var CalculationSetSolve = require('../models/calculationsetsolve');

exports.calculationSetSolveList = function(req, res) {
    CalculationSetSolve.find({})
        .select('-calculationsolves')
        .populate('creator', 'name')
        .populate('calculationset', 'name')
        .exec(function(err, calcsetsolves) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
            return;
        }
        res.json(calcsetsolves);
    });
};

exports.calculationSetSolveDetail = function(req, res) {
    CalculationSetSolve.findById(req.params.calcsetsolve_id)
        .populate('calculationsolves')
        .populate('creator', 'name')
        .populate('calculationset', 'name')
        .exec(function(err, calcsetsolve) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
            return;
        }
        res.json(calcsetsolve);
    });
};