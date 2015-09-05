angular.module('mathApp.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})

		.when('/create', {
			templateUrl : 'app/views/pages/createcalc.html',
			controller  : 'createController',
			controllerAs: 'create'
		})

		.when('/overview', {
			templateUrl : 'app/views/pages/overview.html',
			controller  : 'overviewController',
			controllerAs: 'overview'
		})

		.when('/stats', {
			templateUrl : 'app/views/pages/statistics.html',
			controller  : 'statisticsController',
			controllerAs: 'stats'
		})

		.when('/solve/:calcset_id', {
			templateUrl : 'modalContainer',
			controller : 'solveController',
			resolve: {
				data: ['CalcService', '$route', function (CalcService, $route) {
					return CalcService.fetchCalcSet($route.current.params.calcset_id);
				}]
			}
		})
		
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		});

	$locationProvider.html5Mode(true);
});
