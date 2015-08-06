angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('home', {
		    url: "/",
		    templateUrl: "app/views/pages/home.html"
		});
		
	$locationProvider.html5Mode(true);

});
