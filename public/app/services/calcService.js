angular.module('mathApp.calcService', [])

.factory('CalcService', ['$http', function($http) {

	var calcService = {};

	var currentCalcSet;

	calcService.fetchCalcSet = function(calcset_id) {
		return $http.get('/api/calcsets/' + calcset_id).then(function(response){
			currentCalcSet = response.data;
			return currentCalcSet;
		}, function(response) {
			console.log('Error: ' + response.statusText + response.status );
		});
	};

	calcService.getCurrentCalcSet = function() {
		return currentCalcSet;
	};

	calcService.submitCalcSet = function(calcset) {
		return $http.post('/api/calcsets/', calcset);
	};

	calcService.deleteCalcSet = function(calcset_id) {
		return $http.delete('/api/calcsets/' + calcset_id);
	};

	calcService.submitCalcSetSolve = function(calcsetsolve) {
		return $http.post('/api/calcsets/solve', calcsetsolve);
	};

	calcService.all = function() {
		return $http.get('/api/calcsets/');
	};

	return calcService;
}]);