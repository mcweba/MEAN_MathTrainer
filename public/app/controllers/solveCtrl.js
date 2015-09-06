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

            vm.calcCount = vm.currentCalcSet.calculations.length;
            vm.currentCalcIndex = 1;

            vm.startCalc = function(){
              vm.started = true;
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