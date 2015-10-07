angular.module('mathApp.overview', ['ngTouch', 'ui.grid', 'angular-clipboard', 'ngAnimate', 'ui.bootstrap'])
    .controller('overviewController', ['$filter', '$modal', 'CalcService', '$location', 'currentUser', 'dateTimeSourceFormat', 'dateTimeTargetFormat', 'dateTargetFormat', 'diff_levelMap', 'uiGridConstants', function ($filter, $modal, CalcService, $location, currentUser, dateTimeSourceFormat, dateTimeTargetFormat, dateTargetFormat, diff_levelMap, uiGridConstants) {

        var vm = this;
        var test = 'test';
        vm.mySelections = [];

        CalcService.all()
            .success(function (data) {
                vm.processing = false;
                vm.gridOptions.data = data;
            });

        vm.open = function (size, title, message, messageAddition, showOk, showCancel, cancelFunction, okFunction) {

            var modalInstance = $modal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: ['$modalInstance', OverviewDialogController],
                controllerAs: 'modalController',
                size: size,
                resolve: []
            });

            modalInstance.message = message;
            modalInstance.messageAddition = messageAddition;
            modalInstance.title = title;
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
            vm.messageAddition = $modalInstance.messageAddition;
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
            var message = 'You can copy this URL and share it, to get directly to the arithmetic set solve dialog:';
            var messageAddition = window.location.href.replace("overview", "solve") + '/' + row.entity._id;
            var title = "URL to arithmetic set";
            var size = 'lg';
            vm.open(size, title, message, messageAddition, true, false, function () {
            }, function () {
            });
        };

        vm.start = function (grid, row) {
            $location.path('/solve/' + row.entity._id);
        };

        vm.okDeleteDialog = function () {
            if (vm.creatorId !== currentUser.userId && currentUser.role !== "admin") {

                var title = "Delete not permitted";
                var message = "You're only allowed to delete your own arithmetic sets";
                var size = 'lg';
                vm.open(size, title, message, null, true, false);
                return;
            }

            CalcService.deleteCalcSet(vm.calcSetDeleteId)
                .success(function (data) {
                    vm.processing = false;
                    CalcService.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.gridOptions.data =data;
                        });
                });
        };

        vm.delete = function (grid, row) {
            vm.creatorId = row.entity.creator._id;
            vm.calcSetDeleteId = row.entity._id;

            var title = "Delete arithmetic set?";
            var message = "Do you really want to delete this arithmetic set?";
            vm.open('lg', title, message, null, true, true, (function () {
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
                displayName: 'Description',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false,
                width: "*",
                minWidth: 100
            },
            {
                field: 'creator.name',
                displayName: 'Created by',
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
                displayName: 'Created on',
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
                displayName: 'Difficulty',
                field: 'diff_level',
                cellFilter: 'diff_levelFilter:this',
                type: 'string',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        {value: '1', label: diff_levelMap[1]},
                        {value: '2', label: diff_levelMap[2]},
                        {value: '3', label: diff_levelMap[3]}]
                },
                enableColumnMenu: false,
                width: "10%",
                enableHiding: false
            },
            {
                displayName: 'My score [%]',
                field: 'lastscore',
                type: 'number',
                width: "15%",
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Duration [s]',
                field: 'lastduration',
                type: 'number',
                width: "8%",
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Last solved on',
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
                cellTemplate: '<div class="ui-grid-cell-contents" ><button type="button" class="btn btn-xs btn-info"  rel="tooltip" title = "Share URL"  ng-click="grid.appScope.overview.copyLink(grid, row)"><span style="vertical-align:middle" class="glyphicon glyphicon-share-alt"></span></button></div>',
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
                cellTemplate: '<div  class="ui-grid-cell-contents" ><button type="button" class="btn btn-xs btn-success" rel="tooltip" title = "Solve arithmetics" ng-click="grid.appScope.overview.start(grid, row)"> <span style="vertical-align:middle" class="glyphicon glyphicon-hourglass"></span></button></div>',
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
                cellTemplate: '<div class="ui-grid-cell-contents" ><button type="button" class="btn btn-xs btn-danger"  rel="tooltip" title = "Delete"  ng-click="grid.appScope.overview.delete(grid, row)"><span style="vertical-align:middle" class="glyphicon glyphicon-remove"></span></button></div>',
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

