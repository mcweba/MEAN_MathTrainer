var CalculationSolve = require('../models/calculationsolve');
var CalculationSetSolve = require('../models/calculationsetsolve');

exports.calculationSetSolveList = function(req, res) {
    CalculationSetSolve.find({})
        .select('-calculationsolves -__v')
        .populate('creator', 'name -_id')
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
        .select('-__v')
        .populate('calculationsolves', '-_id -__v -creator -calculation')
        .populate('creator', 'name -_id')
        .populate('calculationset', 'name -_id')
        .exec(function(err, calcsetsolve) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
            return;
        }
        res.json(calcsetsolve);
    });
};