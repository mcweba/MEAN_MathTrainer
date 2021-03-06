angular.module('mathApp.solve', ['ui.bootstrap'])

    .controller('solveController', ['$modal', '$location', '$timeout', function($modal, $location, $timeout) {

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
            if(vm.currentCalcSet === undefined || vm.currentCalcSet === null){
                vm.undefinedCalc = true;
                vm.isCalcActive = true;
                vm.ok = function () {
                    $modalInstance.close();
                    $location.path('/overview');
                };
            }else {

                vm.isCalcActive = vm.currentCalcSet.active;
                if(vm.isCalcActive){
                    vm.calcCount = vm.currentCalcSet.calculations.length;


                    if(vm.currentCalcSet.name !== undefined){
                        vm.name = ' - ' + vm.currentCalcSet.name;
                    }
                    vm.beforestart = true;
                    vm.started = false;
                    vm.finished = false;
                    vm.progress = false;
                    vm.undefinedCalc = false;
                    vm.currentResult = '';
                    vm.calculationSolves = [];
                    vm.wrongCalculations = [];
                    vm.duration = 0;
                    vm.durationTime = 0;
                    vm.points = 0;
                    vm.score = 0;
                    vm.isWrongCalc = false;

                    vm.currentCalcIndex = 1;

                    vm.startCalc = function () {
                        vm.started = true;
                        vm.progress = true;
                        vm.beforestart = false;
                        vm.start = new Date().getTime();
                        vm.setFocusCurrentCalc();
                    };

                    vm.setFocusCurrentCalc = function(){
                        $timeout(function () {
                            var currentCalcElement = angular.element( document.querySelector( '#currentCalc' ) );
                            currentCalcElement[0].focus();
                        });
                    };

                    vm.currentNb1 = function () {
                        if (vm.currentCalcIndex < vm.calcCount + 1) {
                            return vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].number1;
                        }
                    };

                    vm.currentNb2 = function () {
                        if (vm.currentCalcIndex < vm.calcCount + 1) {
                            return vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].number2;
                        }
                    };

                    vm.currentOp = function () {
                        if (vm.currentCalcIndex < vm.calcCount + 1) {
                            return vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].operator;
                        }
                    };

                    vm.addCalc = function (calcId, providedRes, duration, correct) {
                        vm.calculationSolves.push({
                                "calcId": calcId,
                                "providedRes": providedRes,
                                "duration": duration,
                                "correct": correct
                            }
                        );
                    };

                    vm.addWrongCalc = function (number1,number2, operator){
                        vm.wrongCalculations.push({
                                "number1": number1,
                                "number2": number2,
                                "operator": operator
                            }
                        );
                    };

                    vm.nextCalc = function (keyEvent) {
                        if (vm.currentResult !== '' && (keyEvent.which === 13 || keyEvent === true)) {
                            vm.setFocusCurrentCalc();
                            if (vm.currentCalcIndex < vm.calcCount + 1) {
                                var id = vm.currentCalcSet.calculations[vm.currentCalcIndex - 1]._id;
                                var isCalcTrue = vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].result.toString() === vm.currentResult;
                                var calcTime = Math.floor( (new Date().getTime() - vm.start)/1000);
                                vm.duration += calcTime;
                                if (isCalcTrue) {
                                    vm.score += 1;
                                }else{
                                    vm.isWrongCalc = true;
                                    var number1 = vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].number1;
                                    var number2 = vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].number2;
                                    var operator = vm.currentCalcSet.calculations[vm.currentCalcIndex - 1].operator;
                                    vm.addWrongCalc(number1, number2, operator)
                                }
                                vm.addCalc(id, vm.currentResult, calcTime, isCalcTrue);
                                vm.currentCalcIndex += 1;
                                vm.currentResult = '';
                                vm.start = new Date().getTime();
                                if (vm.currentCalcIndex === vm.calcCount + 1) {
                                    vm.started = false;
                                    vm.finished = true;
                                    vm.currentCalcIndex -= 1;
                                    vm.points = Math.floor(100 / vm.calcCount * vm.score);
                                    vm.durationTime = vm.duration + ' seconds';

                                    var result = {
                                        "score": vm.points,
                                        "duration": vm.duration,
                                        "calculationset": vm.currentCalcSet._id,
                                        "calculationSolves": vm.calculationSolves
                                    };
                                    CalcService.submitCalcSetSolve(result);
                                }
                            } else {
                                vm.ok();
                            }
                        }
                    };

                    vm.ok = function () {
                        if ( vm.finished) {
                            $modalInstance.close();
                            $location.path('/overview');
                        }else {
                            vm.nextCalc(true);
                        }
                    };

                    vm.cancel = function () {
                        $modalInstance.dismiss();
                        $location.path('/overview');
                    };
                }else{
                    vm.ok = function () {
                        $modalInstance.close();
                        $location.path('/overview');
                    };
                }
            }
        }
    }]);