var CalculationSolve = require('../models/calculationsolve');
var CalculationSetSolve = require('../models/calculationsetsolve');
var _ = require('lodash');

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

var calcOverallScore = function(calcGroup){
    var cB = _.countBy(calcGroup, function(g){
        return g.correct == true;
    });
    var countTrue = cB.true || 0;
    var countFalse = cB.false || 0;
    var countTotal = countTrue + countFalse;

    var ratio = 0;
    if(countTotal > 0){
        ratio = _.round((countTrue / countTotal) *100, 2);
    }

    return ratio;
};

var calcAverageDuration = function(calcGroup){
    var sum = _.sum(calcGroup, function(q){
        return q.duration;
    });
    var count = calcGroup.length;
    if(count > 0){
        return _.round(sum/count);
    }
    return 0;
};

exports.calculationsolvesList = function(req, res) {
    CalculationSolve.find({})
        .select('-creator -__v')
        .exec(function(err, calculationsolves) {
            if (err){
                var error = new Error(err);
                res.status(400).send({message: error.message});
                return;
            }

            var calcGroups = _.groupBy(calculationsolves, function(s){
                return s.calculation;
            });

            var result = [];
            _(calcGroups).forEach(function(calcGroup){
                var count = calcGroup.length;
                var calc = calcGroup[0].calcAsString;
                result.push({
                    'calculation': calc,
                    'count': count,
                    'avgDuration': calcAverageDuration(calcGroup),
                    'overallSuccess': calcOverallScore(calcGroup)
                });
            }).value();

            res.json(result);
        });
};