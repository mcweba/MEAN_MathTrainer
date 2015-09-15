angular.module('mathApp.statisticsService', [])

.factory('StatisticsService', ['$http', function($http) {

	var statisticsService = {};

	statisticsService.all = function() {
		return $http.get('/api/calcsetsolves/');
	};

	return statisticsService;
}]);