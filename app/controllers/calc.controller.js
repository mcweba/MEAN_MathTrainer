var Calculation = require('../models/calculation');
var CalculationSet = require('../models/calculationset');
var _ = require('lodash');
var Q = require('q');

exports.create = function(req, res) {

    // prepare promises to get or create calculations
    var promises = [];
    _(req.body.calculations).forEach(function(calculation){
        promises.push(createOrGetCalculationId(calculation.n1, calculation.op, calculation.n2, calculation.res));
    }).value();


    // wait for all promises to resolve or reject
    Q.all(promises).then(function(calculations){
        saveCalculationSet(req.decoded.userId, req.body.diff_level, calculations).then(function(){
            res.json({ message: 'CalculationSet successfully created'});
        }).catch(function(error){
            res.status(400).send({message: error.message});
        });
    }).catch(function(error){
        res.status(400).send({message: error.message});
    });

};

exports.get = function(req, res){
    CalculationSet.findById(req.params.calcset_id).populate({path: 'calculations'}).exec(function(err, calcset) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
        }
        res.json(calcset);
    });
};

exports.list = function(req, res) {
    var data = [];
    data.push({id: 1234, creator: 'Fritz', created: new Date(), diff_level: 1, score: 99, duration: 240, lastExec: new Date()});
    data.push({id: 1235, creator: 'Hans', created: new Date(), diff_level: 3, score: 55, duration: 600, lastExec: new Date()});
    data.push({id: 1236, creator: 'Kurt', created: new Date(), diff_level: 2, score: 66, duration: 90, lastExec: new Date()});
    res.json(data);
};

var saveCalculationSet = function(creatorId, diff_level, calculations){
    var deferred = Q.defer();
    
    var calculationSet = new CalculationSet();
    calculationSet.creator = creatorId;
    calculationSet.diff_level = diff_level;
    calculationSet.calculations = calculations;
        
    calculationSet.save(function(err){
        if(err){
            deferred.reject(new Error(error));
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
};

var createOrGetCalculationId = function(num1, op, num2, result){
    var deferred = Q.defer();

    Calculation.findOne({ 'number1': num1, 'operator': op, 'number2': num2 }, function(err, calc) {
        if (!calc) {
            var calcNew = new Calculation();
            calcNew.number1 = num1;
            calcNew.operator = op;
            calcNew.number2 = num2;
            calcNew.result = result;

            calcNew.save(function(error, c) {
                if (error) {
                    deferred.reject(new Error(error));
                } else {
                    deferred.resolve(c._id);
                }
            });
        } else {
            deferred.resolve(calc._id);
        }
    });
    return deferred.promise;
};
