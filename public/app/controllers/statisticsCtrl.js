angular.module('mathApp.stats', ['ngTouch', 'ui.grid', 'ngAnimate', 'ui.bootstrap'])

    .controller('statisticsController', ['StatisticsService', '$modal', function (StatisticsService, $modal) {

        var vm = this;

        vm.open = function (size, title, gridDetailOptions) {

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
            modalInstance.result.then(function () {
                if (modalInstance.modalResult === 'ok') {
                }
            });
        };

        function OverviewDialogController($modalInstance) {
            var vm = this;
            vm.gridDetailOptions = $modalInstance.gridDetailOptions;
            vm.title = $modalInstance.title;
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

        vm.getDetail = function (calcsetsolve_id, calculationsetName) {
            StatisticsService.detail(calcsetsolve_id).success(function (data) {
                vm.gridDetailOptions.data = data.calculationsolves;
                var title = 'Rechnungsset';
                if(calculationsetName !== undefined){
                    title += " - " + calculationsetName;
                    }
                var size = 'lg';
                vm.open(size, title, vm.gridDetailOptions);
            });
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
                displayName: 'Name',
                type: 'string',
                enableColumnMenu: false,
                enableHiding: false
            },
            {
                displayName: 'Meine erreichte Punktzahl',
                field: 'score',
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
            }
        ];

        vm.detail = function (grid, row) {
            vm.getDetail(row.entity._id, row.entity.calculationset.name);
        };

        vm.gridOptions = {
            enableHiding: false,
            enableFiltering: false,
            columnDefs: def
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
                displayName: 'Mein Resultat',
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
            }
        ];

        vm.gridDetailOptions = {
            enableHiding: false,
            enableFiltering: false,
            columnDefs: defDetail
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
    .filter('result_Filter', function (stats_resultMap) {
        return function (value, scope) {
            return stats_resultMap[scope.row.entity.correct]
        };
    });