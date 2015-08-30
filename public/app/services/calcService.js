angular.module('mathApp.calcService', [])

.factory('CalcService', function($http) {

	// create a new object
	var calcService = {};

	// get a single user
	calcService.loadCalcSet = function(calcset_id) {

		console.log('called CalcService')

		var calcset = [];

		var content = {
			calcs: [
				{id:1, n1: 2, op: '+', n2: 4, res:6},
				{id:2, n1: 5, op: '-', n2: 1, res:4},
				{id:3, n1: 8, op: '*', n2: 5, res:40}
			]
		};

		calcset.push(content)

		return calcset;
	};


	// return our entire userFactory object
	return calcService;

});