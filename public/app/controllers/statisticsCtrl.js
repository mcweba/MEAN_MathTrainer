angular.module('mathApp.stats', ['ngTouch', 'ui.grid', 'ngAnimate', 'ui.bootstrap'])

    .controller('statisticsController', ['StatisticsService', function(StatisticsService) {

        var vm = this;

        StatisticsService.all().success(function(data){
            vm.gridOptions.data = data;
        });

        vm.getDetail = function(calcsetsolve_id) {
            StatisticsService.detail(calcsetsolve_id).success(function (data) {
                vm.gridDetailOptions.data = data.calculationsolves;
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
                cellTemplate: '<div class="text-center" style="margin: 0px" ><button  class="glyphicon glyphicon-search" ng-click="grid.appScope.stats.detail(grid, row)"></button></div>',
                enableHiding: false
            }
        ];

        vm.detail = function (grid, row) {
            vm.getDetail(row.entity._id);
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
                displayName: 'Richtig',
                field: 'correct',
                type: 'boolean',
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
            ,
            {
                displayName: 'Ergebnis',
                field: 'providedRes',
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
    });