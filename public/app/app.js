angular.module('mathApp', [
    'mathApp.main',
    'mathApp.routes',
    'mathApp.user',
    'mathApp.create',
    'mathApp.overview',
    'mathApp.stats',
    'mathApp.solve',
    'mathApp.calcService',
    'mathApp.statisticsService',
    'ngAnimate',
    'authService',
    'userService'])
    .constant('dateTimeSourceFormat', 'YYYY-MM-DD HH:mm:ss.SSS')
    .constant('dateTimeTargetFormat', 'DD.MM.YYYY HH:mm')
    .constant('dateTargetFormat', 'DD.MM.YYYY')
    .constant('diff_levelMap', {'1': 'Simple', '2': 'Moderate', '3': 'Difficult'})
    .constant('stats_resultMap', {true: 'Correct', false: 'Wrong'})
        .value('currentUser', {name: {}, userId: {}, role: {}})
        .config(function ($httpProvider) {
            // attach auth interceptor to http requests
            $httpProvider.interceptors.push('AuthInterceptor');
        });