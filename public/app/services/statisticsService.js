angular.module('mathApp.statisticsService', [])

.factory('StatisticsService', ['$http', function($http) {

	var statisticsService = {};

	statisticsService.all = function() {
		return $http.get('/api/calcsetsolves/');
	};

	statisticsService.detail = function(calcsetsolve_id) {
		return $http.get('/api/calcsetsolves/' + calcsetsolve_id);
	};

	return statisticsService;
}]);