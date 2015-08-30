angular.module('mathApp.stats', ['ui.bootstrap'])

    .controller('statisticsController', ['$modal', function($modal) {

        var vm = this;

        vm.showDialog = function(){
            var modalInstance = $modal.open({
                templateUrl: 'app/views/dialogs/calcSolve.html',
                size: 'md',
                backdrop : 'static',
                keyboard: false,
                controller: ['$modalInstance', function($modalInstance){
                    var vm = this;
                    vm.ok = function () {
                        $modalInstance.close();
                    };
                    vm.cancel = function () {
                        $modalInstance.dismiss();
                    };
                }],
                controllerAs: 'vm'
            });

            modalInstance.result.then(function () {
                console.log('dialog done');
            });

        };

    }]);