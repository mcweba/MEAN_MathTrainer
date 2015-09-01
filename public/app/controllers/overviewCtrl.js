angular.module('mathApp.overview', ['ngTouch', 'ui.grid', 'angular-clipboard', 'ngAnimate', 'ui.bootstrap'])

    .controller('overviewController', ['$modal', 'CalcService', function ($modal, CalcService) {
        var vm = this;
        vm.mySelections = [];

        CalcService.all()
            .success(function (data) {
                vm.processing = false;
                vm.gridOptions.data = data;
            });

        vm.open = function (size, linkForCopy) {

            var modalInstance = $modal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'modalController',
                size: size,
                resolve: []
            });

            modalInstance.linkForCopy = linkForCopy;
        };

        vm.toggleAnimation = function () {
            vm.animationsEnabled = !vm.animationsEnabled;
        };

        vm.copyLink = function (grid, row) {
            vm.textToCopy = 'I can copy by clicking!';
            var selectedUID = row.entity.UID;
            var linkForCopy = 'locahost:xx' + selectedUID;

            vm.open('lg', linkForCopy);
        };

        vm.success = function () {
            console.log('Copied!');
        };

        vm.fail = function (err) {
            console.error('Error!', err);
        };

        vm.startTraining = function (grid, row) {
        };

        vm.animationsEnabled = true;

        var def = [
            {field: 'UID', displayName: 'UID', visible: false, enableHiding: false},
            {displayName: 'Erzeuger', field: 'creator', enableHiding: false},
            {displayName: 'Erzeugungsdatum', field: 'created', enableHiding: false},
            {displayName: 'Schwierigkeitsgrad', field: 'diff_level', enableHiding: false},
            {displayName: 'Meine erreichte Punktzahl', field: 'score', enableHiding: false},
            {displayName: 'Dauer', field: 'duration', enableHiding: false},
            {displayName: 'Zuletzt am', field: 'lastExec', enableHiding: false},
            {
                displayName: 'Link kopieren',
                enableColumnMenu: false,
                sortable: false,
                enableSorting: false,
                enableFiltering: false,
                name: 'Link ',
                cellTemplate: '<div class="text-center" style="margin: 0px" ><button clipboard on-copied="grid.appScope.overview.success()" on-error="grid.appScope.overview.fail(err)" class="glyphicon glyphicon-plus" ng-click="grid.appScope.overview.copyLink(grid, row)"></button></div>',
                enableHiding: false
            },
            {
                displayName: 'Starten',
                enableColumnMenu: false,
                sortable: false,
                enableSorting: false,
                enableFiltering: false,
                name: 'Loesen ',
                cellTemplate: '<div  class="text-center" style="margin: 0px" ><button class="glyphicon glyphicon-hourglass" ng-click="grid.appScope.overview.editRow(grid, row)"></button></div>',
                enableHiding: false
            }
        ];

        vm.gridOptions = {
            enableHiding: false,
            enableFiltering: true,
            columnDefs: def
        };
    }
    ]);

angular.module('mathApp.overview').controller('ModalInstanceCtrl', function ($modalInstance) {
    var vm = this;
    vm.linkForCopy = $modalInstance.linkForCopy;
    vm.ok = function () {
        $modalInstance.close();
    };
});