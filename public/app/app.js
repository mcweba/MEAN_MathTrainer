angular.module('mathApp', [
	'mathApp.main',
	'mathApp.routes',
	'mathApp.user',
	'mathApp.create',
	'mathApp.overview',
	'mathApp.stats',
	'ngAnimate',
	'authService',
	'userService'])

.config(function($httpProvider) {
	// attach auth interceptor to http requests
	$httpProvider.interceptors.push('AuthInterceptor');
});