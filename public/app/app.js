angular.module('mathApp', [
    'mathApp.main',
    'mathApp.routes',
    'mathApp.user',
    'mathApp.create',
    'mathApp.overview',
    'mathApp.stats',
    'mathApp.solve',
    'mathApp.calcService',
    'ngAnimate',
    'authService',
    'userService'])
    .constant('dateTimeSourceFormat', 'YYYY-MM-DD HH:mm:ss.SSS')
    .constant('dateTimeTargetFormat', 'DD.MM.YYYY HH:mm')
    .constant('dateTargetFormat', 'DD.MM.YYYY')
    .value('currentUser',{token:""})
    .config(function ($httpProvider) {
        // attach auth interceptor to http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    });