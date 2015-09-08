angular.module('mathApp.solve', ['ui.bootstrap'])

    .controller('solveController', ['$modal', '$location', function($modal, $location) {

        var vm = this;

        var modalInstance = $modal.open({
            templateUrl: 'app/views/dialogs/calcSolve.html',
            size: 'md',
            backdrop : 'static',
            keyboard: false,
            controller: ['$modalInstance', 'CalcService', SolveDialogController],
            controllerAs: 'vm'
        });

        modalInstance.result.then(function () {
            console.log('dialog done');
        });

        function SolveDialogController($modalInstance, CalcService){
            var vm = this;

            vm.currentCalcSet = CalcService.getCurrentCalcSet();

            vm.beforestart = true;
            vm.started = false;
            vm.finished = false;
            vm.progress = false;
            vm.currentResult = '';
            vm.calculationSolves = [];
            vm.duration = 0;
            vm.durationTime = 0;
            vm.score = 0;

            vm.calcCount = vm.currentCalcSet.calculations.length;
            vm.currentCalcIndex = 1;

            vm.startCalc = function(){
                vm.started = true;
                vm.progress = true;
                vm.beforestart = false;
                vm.start = new Date().getTime();
            };

            vm.currentNb1 = function(){
                if (vm.currentCalcIndex <  vm.calcCount + 1) {
                    return vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].number1;
                }
            };

            vm.currentNb2 = function(){
                if (vm.currentCalcIndex <  vm.calcCount + 1) {
                    return vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].number2;
                }
            };

            vm.currentOp = function(){
                if (vm.currentCalcIndex <  vm.calcCount + 1) {
                    return vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].operator;
                }
            };

            vm.addCalc = function(calcId, providedRes, duration, correct){
                vm.calculationSolves.push({
                        "calcId": calcId,
                        "providedRes": providedRes,
                        "duration": duration,
                        "correct": correct
                    }
                )
            };

            vm.nextCalc = function(keyEvent){
                if (keyEvent.which === 13) {
                    if (vm.currentCalcIndex <  vm.calcCount + 1) {
                        var id = vm.currentCalcSet.calculations[vm.currentCalcIndex-1]._id;
                        var isCalcTrue = vm.currentCalcSet.calculations[vm.currentCalcIndex-1].result.toString() === vm.currentResult;
                        var calcTime = new Date().getTime() - vm.start;
                        vm.duration += calcTime;
                        if(isCalcTrue){vm.score +=1;}
                        vm.addCalc(id, vm.currentResult, calcTime, isCalcTrue);
                        vm.currentCalcIndex += 1;
                        console.log('Result: ' +  vm.currentResult);
                        vm.currentResult = '';
                        vm.start = new Date().getTime();
                        if (vm.currentCalcIndex  ===  vm.calcCount + 1)
                        {
                            vm.started = false;
                            vm.finished = true;
                            vm.currentCalcIndex -=1;
                            vm.durationTime = Math.floor(vm.duration /1000) + ' Sekunden';
                        }
                    } else {
                        vm.ok();
                    }
                }
            };

            vm.ok = function () {
                var result ={
                    "score": vm.score,
                    "duration": vm.duration,
                    "calculationset": vm.currentCalcSet._id,
                    "calculationSolves": [vm.calculationSolves
                ]};
                CalcService.submitCalcSetSolve(result);
                // console.log('submitCalcSetSolve: ' + result);
                $modalInstance.close();
                $location.path('/overview');
            };
            vm.cancel = function () {
                $modalInstance.dismiss();
                $location.path('/overview');
            };
        }
    }]);