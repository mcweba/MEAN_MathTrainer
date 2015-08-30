angular.module('mathApp.solve', ['ui.bootstrap'])

    .controller('solveController', ['$modal', '$location', '$routeParams', 'data', function($modal, $location, $routeParams, data) {

        var vm = this;

        vm.inputData = data;

        vm.calcId = $routeParams.calcset_id;

        console.log('data: ' + JSON.stringify(data));

        var modalInstance = $modal.open({
            templateUrl: 'app/views/dialogs/calcSolve.html',
            size: 'md',
            backdrop : 'static',
            keyboard: false,
            controller: ['$modalInstance', '$routeParams', SolveDialogController],
            controllerAs: 'vm'
        });

        modalInstance.result.then(function () {
            console.log('dialog done');
        });

        function SolveDialogController($modalInstance, $routeParams){
            var vm = this;

            vm.calcId = $routeParams.calcset_id;

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