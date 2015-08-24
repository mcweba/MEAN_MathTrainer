angular.module('app.routes', ['ui.router'])

	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

		// For unmatched routes
		$urlRouterProvider.otherwise('/');

		// Application routes
		$stateProvider
			.state('overview', {
				url: '/',
				templateUrl: 'app/views/pages/overview.html'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'app/views/pages/login.html'
			})
			.state('create', {
				url: '/create',
				templateUrl: "app/views/pages/createcalc.html"
			})
			.state('stats', {
				url: '/stats',
				templateUrl: 'app/views/pages/statistics.html'
			});

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

	});
