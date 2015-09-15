angular.module('mathApp.stats', [])

    .controller('statisticsController', ['StatisticsService', function(StatisticsService) {

        var vm = this;

        StatisticsService.all().success(function(data){
            console.log(JSON.stringify(data));
        });

    }]);