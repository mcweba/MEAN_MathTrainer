var CalculationSolve = require('../models/calculationsolve');
var CalculationSetSolve = require('../models/calculationsetsolve');
var _ = require('lodash');
var Q = require('q');

exports.solve = function(req, res){
    var promises = [];
    _(req.body.calculationSolves).forEach(function(calculationSolve){
        promises.push(createCalculationSolveId(calculationSolve.calcId, req.decoded.userId, calculationSolve.providedRes, calculationSolve.duration, calculationSolve.correct));
    }).value();

    Q.all(promises).then(function(calculationSolves){
        saveCalculationSetSolve(req.decoded.userId, req.body.calculationset, req.body.score, req.body.duration, calculationSolves).then(function(){
            res.json({ message: 'CalculationSetSolve successfully created'});
        }).catch(function(error){
            res.status(400).send({message: error.message});
        });
    }).catch(function(error){
        res.status(400).send({message: error.message});
    });
};

var saveCalculationSetSolve = function(creatorId, calculationSetId, score, duration, calculationSolves){
    var deferred = Q.defer();

    var calculationSetSolve = new CalculationSetSolve();
    calculationSetSolve.creator = creatorId;
    calculationSetSolve.calculationset = calculationSetId;
    calculationSetSolve.calculationsolves = calculationSolves;
    calculationSetSolve.score = score;
    calculationSetSolve.duration = duration;

    calculationSetSolve.save(function(err){
        if(err){
            deferred.reject(new Error(error));
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
};

var createCalculationSolveId = function(calcId, creatorId, providedRes, duration, correct){
    var deferred = Q.defer();
    var calcSolve = new CalculationSolve();
    calcSolve.calculation = calcId;
    calcSolve.creator = creatorId;
    calcSolve.providedRes = providedRes;
    calcSolve.duration = duration;
    calcSolve.correct = correct;
    calcSolve.save(function(error, c) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(c._id);
        }
    });
    return deferred.promise;
};
