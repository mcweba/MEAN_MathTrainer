angular.module('mathApp.calcService', [])

.factory('CalcService', ['$http', function($http) {

	var calcService = {};

	var currentCalcSet;

	calcService.fetchCalcSet = function(calcset_id) {
		return $http.get('/api/calcsets/' + calcset_id).then(function(response){
			currentCalcSet = response.data;
			return currentCalcSet;
		});
	};

	calcService.getCurrentCalcSet = function() {
		return currentCalcSet;
	};

	calcService.submitCalcSet = function(calcset) {
		return $http.post('/api/calcsets/', calcset);
	};

	calcService.all = function() {
		return $http.get('/api/calcsets/');
	};

	return calcService;
}]);