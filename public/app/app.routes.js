angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('home', {
		    url: "/",
		    templateUrl: "app/views/pages/home.html"
		});

	$stateProvider
		.state('createcalc', {
			url: "/createcalc",
			templateUrl: "app/views/pages/createcalc.html"
		});
		
	$locationProvider.html5Mode(true);

});
