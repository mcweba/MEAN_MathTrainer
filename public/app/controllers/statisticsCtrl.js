angular.module('mathApp.stats', ['ngTouch', 'ui.grid', 'ngAnimate', 'ui.bootstrap'])

    .controller('statisticsController', ['StatisticsService', function(StatisticsService) {

        var vm = this;

        StatisticsService.all().success(function(data){

            vm.gridOptions.data = data;
           // console.log(JSON.stringify(data));
        });

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
            }
        ];

        vm.gridOptions = {
            enableHiding: false,
            enableFiltering: false,
            columnDefs: def
        };
    }]);