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

            vm.started = false;
            vm.currentResult = '';

            vm.calcCount = vm.currentCalcSet.calculations.length;
            vm.currentCalcIndex = 1;

            vm.startCalc = function(){
              vm.started = true;
            };

            vm.currentNb1 = function(){
                return vm.currentCalcSet.calculations[vm.currentCalcIndex-1].number1;
            };

            vm.currentNb2 = function(){
                return vm.currentCalcSet.calculations[vm.currentCalcIndex-1].number1;
            };

            vm.currentOp = function(){
                return vm.currentCalcSet.calculations[vm.currentCalcIndex-1].operator;
            };

            vm.nextCalc = function(keyEvent){
                if (keyEvent.which === 13) {
                    if (vm.currentCalcIndex < vm.calcCount) {
                        vm.currentCalcIndex += 1;
                        console.log('Result: ' +  vm.currentResult);
                        vm.currentResult = '';
                    } else {
                        vm.ok();
                    }
                }
            };

            vm.ok = function () {
                $modalInstance.close();
                $location.path('/overview');
            };
            vm.cancel = function () {
                $modalInstance.dismiss();
                $location.path('/overview');
            };
        }

    }]);