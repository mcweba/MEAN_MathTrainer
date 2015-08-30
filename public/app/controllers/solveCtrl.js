angular.module('mathApp.solve', ['ui.bootstrap'])

    .controller('solveController', ['$modal', '$location', function($modal, $location) {

        var vm = this;

        var modalInstance = $modal.open({
            templateUrl: 'app/views/dialogs/calcSolve.html',
            size: 'md',
            backdrop : 'static',
            keyboard: false,
            controller: ['$modalInstance', '$routeParams', 'CalcService', SolveDialogController],
            controllerAs: 'vm'
        });

        modalInstance.result.then(function () {
            console.log('dialog done');
        });

        function SolveDialogController($modalInstance, $routeParams, CalcService){
            var vm = this;

            vm.currentCalcSet = CalcService.getCurrentCalcSet();

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