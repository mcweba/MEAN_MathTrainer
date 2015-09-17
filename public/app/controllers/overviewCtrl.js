angular.module('mathApp.overview', ['ngTouch', 'ui.grid', 'angular-clipboard', 'ngAnimate', 'ui.bootstrap'])
    .controller('overviewController', ['$modal', 'CalcService', '$location', 'currentUser', 'dateTimeSourceFormat', 'dateTimeTargetFormat', 'dateTargetFormat', 'diff_levelMap', function ($modal, CalcService, $location, currentUser, dateTimeSourceFormat, dateTimeTargetFormat, dateTargetFormat, diff_levelMap) {
        var vm = this;
        var test = 'test';
        vm.mySelections = [];

        CalcService.all()
            .success(function (data) {
                vm.processing = false;
                vm.gridOptions.data = data;
            });

        vm.open = function (size, title, message, showOk, showCancel, cancelFunction, okFunction) {

            var modalInstance = $modal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: ['$modalInstance', OverviewDialogController],
                controllerAs: 'modalController',
                size: size,
                resolve: []
            });

            modalInstance.message = message;
            modalInstance.title = title
            modalInstance.showOk = showOk;
            modalInstance.showCancel = showCancel;
            modalInstance.result.then(function () {
                if (modalInstance.modalResult === 'cancel') {
                    cancelFunction();
                } else if (modalInstance.modalResult === 'ok') {
                    okFunction();
                }
            });
        };

        function OverviewDialogController($modalInstance) {
            var vm = this;
            vm.message = $modalInstance.message;
            vm.title = $modalInstance.title;
            vm.showCancel = $modalInstance.showCancel;
            vm.showOk = $modalInstance.showOk;
            vm.ok = function () {
                $modalInstance.modalResult = 'ok';
                $modalInstance.close();
            };
            vm.cancel = function () {
                $modalInstance.modalResult = 'cancel';
                $modalInstance.close();
            };
        }

        vm.toggleAnimation = function () {
            vm.animationsEnabled = !vm.animationsEnabled;
        };

        vm.copyLink = function (grid, row) {
            var message = window.location.href.replace("overview", "solve") + '/' + row.entity._id;
            var title = "Link zum Einladen...";
            var size = 'lg';
            vm.open(size, title, message, true, false, function () {
            }, function () {
            });
        };

        vm.start = function (grid, row) {
            $location.path('/solve/' + row.entity._id);
        };

        vm.okDeleteDialog = function () {
            if (vm.creatorId !== currentUser.userId && currentUser.role !== "admin") {

                var title = "Löschen nicht möglich";
                var message = "Es können nur eigene, also von Ihnen erzeugte, Rechnunssets gelöscht werden";
                var size = 'lg';
                vm.open(size, title, message, true, false);
                return;
            }

            CalcService.deleteCalcSet(vm.calcSetDeleteId)
                .success(function (data) {
                    vm.processing = false;
                    CalcService.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.gridOptions.data = data;
                        });
                });
        };

        vm.delete = function (grid, row) {
            vm.creatorId = row.entity.creator._id;
            vm.calcSetDeleteId = row.entity._id;

            var title = "Rechungsset löschen?";
            var message = "Möchten Sie das Rechnungsset wirklich löschen?";
            vm.open('lg', title, message, true, true, (function () {
            }), vm.okDeleteDialog);
        };

        vm.fail = function (err) {
            console.error('Error!', err);
        };

        vm.startTraining = function (grid, row) {
        };

        vm.diff_levelCondition = function (term, value, row, column) {
            if (!value) {
                return true;
            } else {
                return isStringContainingTerm(diff_levelMap[value], term);
            }
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
                cellFilter: 'diff_levelFilter:this',
                type: 'string',
                filter: {condition: vm.diff_levelCondition},
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
                cellTemplate: '<div class="text-center" style="margin: 0px" ><button  class="glyphicon glyphicon-share-alt" ng-click="grid.appScope.overview.copyLink(grid, row)"></button></div>',
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
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2,
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
    })
    .filter('diff_levelFilter', function (diff_levelMap) {
        return function (value, scope) {
            return diff_levelMap[scope.row.entity.diff_level]
        };
    })
;
