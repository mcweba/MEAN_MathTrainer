var Calculation = require('../models/calculation');
var CalculationSolve = require('../models/calculationsolve');
var CalculationSetSolve = require('../models/calculationsetsolve');
var CalculationSetInfo = require('../models/calculationsetinfo');
var _ = require('lodash');
var Q = require('q');

exports.solve = function(req, res){
    var promises = [];
    _(req.body.calculationSolves).forEach(function(calculationSolve){
        promises.push(createCalculationSolveId(calculationSolve.calcId, req.decoded.userId, calculationSolve.providedRes, calculationSolve.duration, calculationSolve.correct));
    }).value();

    Q.all(promises).then(function(calculationSolves){
        Q.all([
            saveCalculationSetSolve(req.decoded.userId, req.body.calculationset, req.body.score, req.body.duration, calculationSolves),
            updateCalculationSetInfo(req.decoded.userId, req.body.calculationset, req.body.score, req.body.duration)
        ]).then(function(){
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

var updateCalculationSetInfo = function(creatorId, calculationSetId, score, duration){
    var deferred = Q.defer();

    CalculationSetInfo.findOne({ 'creator': creatorId, 'calculationset': calculationSetId }, function(err, calcsetInfo) {
        if (!calcsetInfo) {
            var calcsetInfoNew = new CalculationSetInfo();
            calcsetInfoNew.creator = creatorId;
            calcsetInfoNew.calculationset = calculationSetId;
            calcsetInfoNew.lastscore = score;
            calcsetInfoNew.lastduration = duration;
            calcsetInfoNew.lastsolve = new Date();

            calcsetInfoNew.save(function(error, c) {
                if (error) {
                    deferred.reject(new Error(error));
                } else {
                    deferred.resolve(c._id);
                }
            });
        } else {
            //update calcsetInfo
            calcsetInfo.lastscore = score;
            calcsetInfo.lastduration = duration;
            calcsetInfo.lastsolve = new Date();

            calcsetInfo.save(function(error, c) {
                if (error) {
                    deferred.reject(new Error(error));
                } else {
                    deferred.resolve(c._id);
                }
            });
        }
    });
    return deferred.promise;
};

var createCalculationSolveId = function(calcId, creatorId, providedRes, duration, correct){
    var deferred = Q.defer();

    Calculation.findById(calcId).exec(function(err, calculation) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
            return;
        }

        if(!calculation){
            res.status(404).send({message: 'Calculation with id ' + calcId + ' could not been found'});
            return;
        }

        var calcSolve = new CalculationSolve();
        calcSolve.calculation = calcId;
        calcSolve.creator = creatorId;
        calcSolve.calcAsString = calculation.number1 + " " + calculation.operator + " " + calculation.number2 + " = " + calculation.result;
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

    });
    return deferred.promise;
};
