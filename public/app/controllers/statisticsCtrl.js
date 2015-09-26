angular.module('mathApp.stats', ['ngTouch', 'ui.grid', 'ngAnimate', 'ui.bootstrap'])

    .controller('statisticsController', ['StatisticsService', '$modal','dateTimeSourceFormat', 'dateTimeTargetFormat', 'dateTargetFormat', function (StatisticsService, $modal,dateTimeSourceFormat, dateTimeTargetFormat, dateTargetFormat) {

        var vm = this;

        vm.open = function (size, title, subtitle, gridDetailOptions) {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                controller: ['$modalInstance', OverviewDialogController],
                controllerAs: 'modalController',
                size: size,
                resolve: []
            });

            modalInstance.gridDetailOptions = gridDetailOptions;
            modalInstance.title = title;
            modalInstance.subtitle = subtitle;
            modalInstance.result.then(function () {
                if (modalInstance.modalResult === 'ok') {
                }
            });
        };

        function OverviewDialogController($modalInstance) {
            var vm = this;
            vm.gridDetailOptions = $modalInstance.gridDetailOptions;
            vm.title = $modalInstance.title;
            vm.subtitle = $modalInstance.subtitle;
            vm.showCancel = $modalInstance.showCancel;
            vm.showOk = $modalInstance.showOk;
            vm.ok = function () {
                $modalInstance.modalResult = 'ok';
                $modalInstance.close();
            };
        }

        StatisticsService.all().success(function (data) {
            vm.gridOptions.data = data;
        });

        StatisticsService.calculations().success(function (data) {
            vm.gridCalulationsOptions.data = data;
        });

        vm.getDetail = function (calcsetsolve_id, calculationsetName) {
            StatisticsService.detail(calcsetsolve_id).success(function (data) {
                vm.gridDetailOptions.data = data.calculationsolves;
                var title = 'Details von Rechnungsset';
                var subtitle = "Gelöst durch " + data.creator.name + " am " + moment(data.created, dateTimeSourceFormat).format(dateTimeTargetFormat);
                if (calculationsetName !== undefined) {
                    title += " - " + calculationsetName;
                }
                var size = 'lg';
                vm.open(size, title, subtitle, vm.gridDetailOptions);
            });
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
                displayName: 'Erstellt',
                field: 'created',
                type: 'date',
                enableColumnMenu: false,
                enableHiding: false,
                filter: {condition: vm.dateFilter},
                cellFilter: 'dateTimeFormaterCreated',
                filterCellFiltered: true
            },
            {
                field: 'calculationset.name',
                displayName: 'Bezeichnung',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                field: 'creator.name',
                displayName: 'Gelöst von',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Ergebnis [%]',
                field: 'score',
                type: 'number',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Dauer [s]',
                field: 'duration',
                type: 'number',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Detail',
                type: 'object',
                width: '60',
                enableColumnMenu: false,
                sortable: false,
                enableSorting: false,
                enableFiltering: false,
                name: 'link ',
                cellTemplate: '<div class="text-center" style="margin: 0px" ><button class="btn btn-xs btn-success glyphicon glyphicon-search" rel="tooltip" title = "Detail" ng-click="grid.appScope.stats.detail(grid, row)"></button></div>',
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

        var defCalulations = [
            {
                field: 'calculation',
                displayName: 'Rechnung',
                type: 'text',
                visible: true,
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Anzahl gelöst',
                field: 'count',
                type: 'number',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Durch. Dauer[s]',
                field: 'avgDuration',
                type: 'number',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Korrekt gelöst [%]',
                field: 'overallSuccess',
                type: 'number',
                enableColumnMenu: false,
                enableHiding: false
            }
        ];

        vm.detail = function (grid, row) {
            vm.getDetail(row.entity._id, row.entity.calculationset.name);
        };

        vm.gridOptions = {
            enableHiding: false,
            enableFiltering: true,
            columnDefs: def,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2
        };

        vm.gridCalulationsOptions = {
            enableHiding: false,
            enableFiltering: true,
            columnDefs: defCalulations,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2
        };

        var defDetail = [
            {
                field: '_id',
                displayName: 'id',
                type: 'number',
                visible: false,
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Ergebnis',
                field: 'correct',
                type: 'boolean',
                cellFilter: 'result_Filter:this',
                enableColumnMenu: false,
                cellTemplate: '<div class="ui-grid-cell-contents" ng-show="row.entity.correct===true"><span class="glyphicon glyphicon-thumbs-up" style="color:green"></span></div>' +
                '<div class="ui-grid-cell-contents" ng-show="row.entity.correct===false"><span class="glyphicon glyphicon-thumbs-down" style="color:red"></span></div>',
                enableHiding: false
            },
            {
                displayName: 'Rechnung',
                field: 'calcAsString',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Erfasstes Resultat',
                field: 'providedRes',
                type: 'number',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Dauer[s]',
                field: 'duration',
                type: 'number',
                enableColumnMenu: false,
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

        vm.gridDetailOptions = {
            enableHiding: false,
            enableFiltering: false,
            columnDefs: defDetail,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 2,
        };

        vm.dateTimeFilter = function (term, value) {
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

        vm.dateFilter = function (term, value) {
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
    }])
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
    .filter('result_Filter', function (stats_resultMap) {
        return function (value, scope) {
            return stats_resultMap[scope.row.entity.correct]
        };
    });