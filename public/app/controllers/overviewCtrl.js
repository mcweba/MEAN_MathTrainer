angular.module('mathApp.overview', ['ngTouch', 'ui.grid', 'angular-clipboard', 'ngAnimate', 'ui.bootstrap'])
        .controller('overviewController', ['$modal', 'CalcService', '$location','dateTimeSourceFormat','dateTimeTargetFormat','dateTargetFormat', function ($modal, CalcService, $location,dateTimeSourceFormat,dateTimeTargetFormat,dateTargetFormat) {
        var vm = this;
        var test = 'test';
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
            //console.log('Start...' + 'row.entity.id: ' + row.entity.id);
            // Todo fixe id ist noch zu ersetzen zurzeit nur für Testzweck
            $location.path('/solve/' + '55ee7a40d258ad641d52598e');
            //$location.path('/solve/' + row.entity.id);
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

        vm.dateTimeFilter = function (term, value, row, column) {

            if (!value) {
                return true;
            } else {
                if (!moment(value, dateTimeSourceFormat).isValid()) {
                    return true;
                }

                var momentAsString = moment(value, dateTimeSourceFormat ).format(dateTimeTargetFormat);
                return isStringContainingTerm(momentAsString,term);
            }
        }

        var isStringContainingTerm = function (momentAsString,term){
            var index = term.indexOf("\\");
            while (index >= 0) {
                term = term.replace("\\", "");
                index = term.indexOf("\\");
            }
            return momentAsString.indexOf(term) > -1;
        }

        vm.dateFilter = function (term, value, row, column) {
            if (!value) {
                return true;
            } else {
                if (!moment(value, dateTimeSourceFormat).isValid()) {
                    return true;
                }

                var momentAsString = moment(value, dateTimeSourceFormat).format(dateTargetFormat);
                return isStringContainingTerm(momentAsString,term);
            }
        }

        vm.animationsEnabled = true;

        var def = [
            {field: 'UID', displayName: 'UID', visible: false, enableColumnMenu: false, enableHiding: false},
            {displayName: 'Erzeuger', field: 'creator',enableColumnMenu: false, enableHiding: false},
            {
                displayName: 'Erzeugungsdatum',
                field: 'created',
                enableHiding: false,
                enableColumnMenu: false,
                filter: {condition: vm.dateFilter},
                cellFilter: 'dateTimeFormaterCreated',
                filterCellFiltered: true
            },
            {displayName: 'Schwierigkeitsgrad', field: 'diff_level', enableColumnMenu: false, enableHiding: false},
            {displayName: 'Meine erreichte Punktzahl', field: 'score', enableColumnMenu: false, enableHiding: false},
            {displayName: 'Dauer[s]', field: 'duration', enableColumnMenu: false, enableHiding: false},
            {
                displayName: 'Zuletzt am',
                field: 'lastExec',
                enableHiding: false,
                enableColumnMenu: false,
                filter: {condition: vm.dateTimeFilter},
                cellFilter: 'dateTimeFormaterLastExec',
                filterCellFiltered: false
            },
            {
                displayName: '',
                width: '40',
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
                width: '40',
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
                width: '40',
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
    .filter('dateTimeFormaterCreated', function (dateTimeSourceFormat,dateTargetFormat) {
        return function (input) {
            if (!input) {
                return '';
            } else {
                if (!moment(input, dateTimeSourceFormat).isValid()) {
                    return input;
                }
                return moment(input, dateTimeSourceFormat).format(dateTargetFormat);
            }
        };
    })
    .filter('dateTimeFormaterLastExec', function (dateTimeSourceFormat,dateTimeTargetFormat) {
        return function (input) {
            if (!input) {
                return '';
            } else {
                if (!moment(input, dateTimeSourceFormat).isValid()) {
                    return input;
                }
                return moment(input, dateTimeSourceFormat).format(dateTimeTargetFormat);
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