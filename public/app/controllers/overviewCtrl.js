angular.module('mathApp.overview', ['ngTouch', 'ui.grid', 'angular-clipboard', 'ngAnimate', 'ui.bootstrap'])
    .controller('overviewController', ['$modal', 'CalcService', '$location', 'currentUser', 'dateTimeSourceFormat', 'dateTimeTargetFormat', 'dateTargetFormat', function ($modal, CalcService, $location, currentUser, dateTimeSourceFormat, dateTimeTargetFormat, dateTargetFormat) {
        var vm = this;
        var test = 'test';
        vm.mySelections = [];

        CalcService.all()
            .success(function (data) {
                vm.processing = false;
                vm.gridOptions.data = data;
            });


        vm.open = function (size, title, message) {

            var modalInstance = $modal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'modalController',
                size: size,
                resolve: []
            });

            modalInstance.message = message;
            modalInstance.title = title
        };

        vm.toggleAnimation = function () {
            vm.animationsEnabled = !vm.animationsEnabled;
        };

        vm.copyLink = function (grid, row) {
            var message = window.location.href.replace("overview", "solve") + '/' + row.entity._id;
            var title = "Link zum Einladen..."
            vm.open('lg', title, message);
        };

        vm.start = function (grid, row) {
            $location.path('/solve/' + row.entity._id);
        };

        vm.delete = function (grid, row) {
            var rowToDeleteId = row.entity._id;
            var creatorId = row.entity.creator._id;

            if (creatorId !== currentUser.userId && currentUser.role !== "Admin") {

                var title = "L&Ouml;schen nicht möglich"
                var message = "Es können nur eigene, also von Ihnen erzeugte, Rechnunssets gelöscht werden";
                vm.open('lg', title, message);
                return
            }
a
            CalcService.deleteCalcSet(rowToDeleteId)
                .success(function (data) {
                    vm.processing = false;
                    vm.gridOptions.data = data;
                });
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

                var momentAsString = moment(value, dateTimeSourceFormat).format(dateTimeTargetFormat);
                return isStringContainingTerm(momentAsString, term);
            }
        };

        var isStringContainingTerm = function (momentAsString, term) {
            var index = term.indexOf("\\");
            while (index >= 0) {
                term = term.replace("\\", "");
                index = term.indexOf("\\");
            }
            return momentAsString.indexOf(term) > -1;
        };

        vm.dateFilter = function (term, value, row, column) {
            if (!value) {
                return true;
            } else {
                if (!moment(value, dateTimeSourceFormat).isValid()) {
                    return true;
                }

                var momentAsString = moment(value, dateTimeSourceFormat).format(dateTargetFormat);
                return isStringContainingTerm(momentAsString, term);
            }
        };

        vm.animationsEnabled = true;

        var def = [
            {
                field: '_id',
                displayName: 'id',
                type: 'number',
                visible: false,
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                field: 'creator.name',
                displayName: 'Ersteller',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                field: 'creator._id',
                displayName: 'ErstellerID',
                type: 'number',
                visible: false,
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Erstellt am',
                field: 'created',
                type: 'date',
                enableHiding: false,
                enableColumnMenu: false,
                filter: {condition: vm.dateFilter},
                cellFilter: 'dateTimeFormaterCreated',
                filterCellFiltered: true
            },
            {
                displayName: 'Schwierigkeitsgrad',
                field: 'diff_level',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Meine erreichte Punktzahl',
                field: 'lastscore',
                type: 'number',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Dauer[s]',
                field: 'lastduration',
                type: 'number',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Zuletzt am',
                field: 'lastsolve',
                type: 'date',
                enableHiding: false,
                enableColumnMenu: false,
                filter: {condition: vm.dateTimeFilter},
                cellFilter: 'dateTimeFormaterLastExec',
                filterCellFiltered: false
            },
            {
                displayName: '',
                type: 'object',
                width: '40',
                enableColumnMenu: false,
                sortable: false,
                enableSorting: false,
                enableFiltering: false,
                name: 'link ',
                cellTemplate: '<div class="text-center" style="margin: 0px" ><button clipboard on-copied="grid.appScope.overview.success()" on-error="grid.appScope.overview.fail(err)" class="glyphicon glyphicon-share-alt" ng-click="grid.appScope.overview.copyLink(grid, row)"></button></div>',
                enableHiding: false
            },
            {
                displayName: '',
                type: 'object',
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
                type: 'object',
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
    .filter('dateTimeFormaterCreated', function (dateTimeSourceFormat, dateTargetFormat) {
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
    .filter('dateTimeFormaterLastExec', function (dateTimeSourceFormat, dateTimeTargetFormat) {
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
    vm.message = $modalInstance.message;
    vm.title = $modalInstance.title
    vm.ok = function () {
        $modalInstance.close();
    };
});