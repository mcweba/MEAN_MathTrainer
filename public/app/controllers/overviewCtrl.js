angular.module('mathApp.overview', ['ngTouch', 'ui.grid', 'angular-clipboard', 'ngAnimate', 'ui.bootstrap'])
    .controller('overviewController', ['$filter', '$modal', 'CalcService', '$location', 'currentUser', 'dateTimeSourceFormat', 'dateTimeTargetFormat', 'dateTargetFormat', 'diff_levelMap','uiGridConstants', function ($filter, $modal, CalcService, $location, currentUser, dateTimeSourceFormat, dateTimeTargetFormat, dateTargetFormat, diff_levelMap,uiGridConstants) {

        var vm = this;
        var test = 'test';
        vm.mySelections = [];

        vm.globalFilter = function (entry) {
            if (currentUser.role !== "Admin" && entry.active === false) {
                return false;
            }
            return true;
        }

        CalcService.all()
            .success(function (data) {
                vm.processing = false;
                vm.gridOptions.data = $filter('filter')(data, vm.globalFilter);
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
                            vm.gridOptions.data = $filter('filter')(data, vm.globalFilter);
                            ;
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
                field: 'name',
                displayName: 'Bezeichnung',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false,
                width: "*",
                minWidth: 100
            },
            {
                field: 'creator.name',
                displayName: 'Ersteller',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false,
                width: "10%"
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
                width: "8%",
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
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        { value: '1', label: diff_levelMap[1] },
                        { value: '2', label: diff_levelMap[2] },
                        { value: '3', label: diff_levelMap[3]} ]
                },
                enableColumnMenu: false,
                width: "13%",
                enableHiding: false
            },
            {
                displayName: 'Meine Punktzahl',
                field: 'lastscore',
                type: 'number',
                width: "10%",
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Dauer[s]',
                field: 'lastduration',
                type: 'number',
                width: "8%",
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Zuletzt am',
                field: 'lastsolve',
                type: 'date',
                width: "12%",
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
                cellTemplate: '<div class="text-center" style="margin: 0px" ><button role="button" rel="tooltip" title = "Link kopieren" class="glyphicon glyphicon-share-alt" ng-click="grid.appScope.overview.copyLink(grid, row)"></button></div>',
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
                cellTemplate: '<div  class="text-center" style="margin: 0px" ><button role="button" rel="tooltip" title = "Aufgaben lösen" class="glyphicon glyphicon-hourglass" ng-click="grid.appScope.overview.start(grid, row)"></button></div>',
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
                cellTemplate: '<div  class="text-center" style="margin: 0px" ><button role="button" rel="tooltip" title = "Löschen" class="glyphicon glyphicon-remove" ng-click="grid.appScope.overview.delete(grid, row)"></button></div>',
                enableHiding: false
            },
            {
                displayName: '',
                type: 'object',
                width: '18',
                enableColumnMenu: false,
                sortable: false,
                enableSorting: false,
                enableFiltering: false,
                name: 'scrollbar ',
                enableHiding: false
            }
        ];

        vm.gridOptions = {
            enableHiding: false,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2,
            columnDefs: def,
            filterOptions: vm.globalFilter
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
    });

