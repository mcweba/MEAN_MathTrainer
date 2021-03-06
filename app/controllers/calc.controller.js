var Calculation = require('../models/calculation');
var CalculationSet = require('../models/calculationset');
var CalculationSetInfo = require('../models/calculationsetinfo');
var CalculationSetSolve = require('../models/calculationsetsolve');
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
        saveCalculationSet(req.decoded.userId, req.body.name, req.body.diff_level, calculations).then(function(){
            res.json({ message: 'CalculationSet successfully created'});
        }).catch(function(error){
            res.status(400).send({message: error.message});
        });
    }).catch(function(error){
        res.status(400).send({message: error.message});
    });

};

exports.get = function(req, res){
    CalculationSet.findById(req.params.calcset_id)
    .select('-__v -creator')
    .populate('calculations', '-__v')
    .exec(function(err, calcset) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
            return;
        }
        res.json(calcset);
    });
};

exports.delete = function(req, res){
    CalculationSet.findById(req.params.calcset_id).exec(function(err, calcset) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
            return;
        }

        if(!calcset){
            res.status(404).send({message: 'CalculationSet with id ' + req.params.calcset_id + ' could not been found'});
            return;
        }

        if(req.decoded.role != 'admin' && req.decoded.userId != calcset.creator){
            res.status(403).send({message: 'Only the creator or an admin has the permission to delete'});
            return;
        }

        CalculationSetSolve.find({calculationset: calcset}).limit(1).exec(function(err, calcsetsolve){
            if (err){
                var error = new Error(err);
                res.status(400).send({message: error.message});
                return;
            }

            if(!_.isEmpty(calcsetsolve)){
                calcset.active = false;
                calcset.save(function(err){
                    if(err){
                        var error = new Error(err);
                        res.status(400).send({message: error.message});
                        return;
                    } else {
                        res.json({ message: 'CalculationSet successfully deactivated (but not deleted)'});
                        return;
                    }
                });                
            } else {
                CalculationSet.findByIdAndRemove({_id: calcset._id}, function(err){
                    if(err){
                        res.status(400).send({message: error.message});
                    } else {
                        res.json({ message: 'CalculationSet successfully removed'});
                    }
                });
            }
        });
    });
};

exports.list = function(req, res) {
    CalculationSet.find({active:true}).select('-calculations').populate('creator', 'name').exec(function(err, calcsets) {
        if (err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
            return;
        }

        findCalculationSetInfoByUser(req.decoded.userId).then(function(calcsetInfos){
            var enrichedCalcsets = [];
            _(calcsets).forEach(function(calcset){
                var calcsetinfo = findCalculationSetInfoByCalcset(calcset._id, calcsetInfos);
                if(calcsetinfo) {
                    enrichedCalcsets.push({
                        '_id': calcset._id,
                        'name': calcset.name,
                        'active': calcset.active,
                        'diff_level': calcset.diff_level,
                        'creator': calcset.creator,
                        'created': calcset.created,
                        'lastscore': calcsetinfo.lastscore,
                        'lastduration': calcsetinfo.lastduration,
                        'lastsolve': calcsetinfo.lastsolve
                    });
                } else {
                    enrichedCalcsets.push(calcset);
                }
            }).value();
            res.json(enrichedCalcsets);
        }).catch(function(err){
            var error = new Error(err);
            res.status(400).send({message: error.message});
        });
    });
};

var saveCalculationSet = function(creatorId, name, diff_level, calculations){
    var deferred = Q.defer();

    var calculationSet = new CalculationSet();
    calculationSet.creator = creatorId;
    calculationSet.name = name;
    calculationSet.diff_level = diff_level;
    calculationSet.calculations = calculations;
    calculationSet.active = true;

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

var findCalculationSetInfoByUser = function(creatorId){
    var deferred = Q.defer();
    CalculationSetInfo.find({ 'creator': creatorId }, function(err, calcsetInfos) {
        if(err){
            deferred.reject(new Error(err));
        }
        deferred.resolve(calcsetInfos);
    });
    return deferred.promise;
};

var findCalculationSetInfoByCalcset = function(calcsetId, calcsetInfos){
    return _.find(calcsetInfos, function(csi) {
        return csi.calculationset.equals(calcsetId);
    });
};