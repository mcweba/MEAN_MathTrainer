angular.module('mathApp.calcService', [])

.factory('CalcService', ['$http', function($http) {

	var calcService = {};

	var currentCalcSet;

	calcService.fetchCalcSet = function(calcset_id) {
		var content = {
			calcs: [
				{id:1, n1: 2, op: '+', n2: 4, res:6},
				{id:2, n1: 5, op: '-', n2: 1, res:4},
				{id:3, n1: 8, op: '*', n2: 5, res:40}
			]
		};

		currentCalcSet = content;
		return content;
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