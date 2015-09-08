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

        vm.start = function (grid, row) {

        };

        vm.delete = function (grid, row) {

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

            {displayName: 'Erzeugungsdatum', field: 'created', enableHiding: false, cellFilter: 'dateTimeFormaterCreated', filterCellFiltered:true},
            {displayName: 'Schwierigkeitsgrad', field: 'diff_level', enableHiding: false},
            {displayName: 'Meine erreichte Punktzahl', field: 'score', enableHiding: false},
            {displayName: 'Dauer[s]', field: 'duration', enableHiding: false},
            {displayName: 'Zuletzt am', field: 'lastExec', enableHiding: false, cellFilter: 'dateTimeFormaterLastExec', filterCellFiltered:false },
            {
                displayName: '',
                width : '40',
                enableColumnMenu: false,
                sortable: false,
                enableSorting: false,
                enableFiltering: false,
                name: 'link ',
                cellTemplate: '<div class="text-center" style="margin: 0px" ><button clipboard on-copied="grid.appScope.overview.success()" on-error="grid.appScope.overview.fail(err)" class="glyphicon glyphicon-plus" ng-click="grid.appScope.overview.copyLink(grid, row)"></button></div>',
                enableHiding: false
            },
            {
                displayName: '',
                width : '40',
                enableColumnMenu: false,
                sortable: false,
                enableSorting: false,
                enableFiltering: false,
                name: 'start ',
                cellTemplate: '<div  class="text-center" style="margin: 0px" ><button class="glyphicon glyphicon-hourglass" ng-click="grid.appScope.overview.start(grid, row)"></button></div>',
                enableHiding: false
            },
            {
                displayName: '',
                width : '40',
                enableColumnMenu: false,
                sortable: false,
                enableSorting: false,
                enableFiltering: false,
                name: 'delete ',
                cellTemplate: '<div  class="text-center" style="margin: 0px" ><button class="glyphicon glyphicon-remove" ng-click="grid.appScope.overview.delete(grid, row)"></button></div>',
                enableHiding: false
            }
        ];

            vm.gridOptions = {
            enableHiding: false,
            enableFiltering: true,
            columnDefs: def
        };
    }
    ])

    .filter('dateTimeFormaterCreated', function() {
        return function(input) {
            if (!input){
                return '';
            } else {
                if (!moment(input,'YYYY-MM-DD HH:mm:ss.SSS').isValid()) {
                    return  input;
                }
                return moment(input,'YYYY-MM-DD HH:mm:ss.SSS').format('DD.MM.YYYY') ;
            }
        };
    })
    .filter('dateTimeFormaterLastExec', function() {
            return function(input) {
            if (!input){
                return '';
            } else {
                if (!moment(input,'YYYY-MM-DD HH:mm:ss.SSS').isValid()) {
                   return  input;
                }
                return moment(input,'YYYY-MM-DD HH:mm:ss.SSS').format('DD.MM.YYYY HH:mm') ;
            }
        };
    });



angular.module('mathApp.overview').controller('ModalInstanceCtrl', function ($modalInstance) {
    var vm = this;
    vm.linkForCopy = $modalInstance.linkForCopy;
    vm.ok = function () {
        $modalInstance.close();
    };
});