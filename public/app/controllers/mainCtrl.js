angular.module('mathApp.main', [])

.controller('mainController', ['$rootScope', '$location', 'AuthService','currentUser', function($rootScope, $location, AuthService,currentUser) {
	var vm = this;
	vm.loggedIn = AuthService.isLoggedIn();

	// check if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = AuthService.isLoggedIn();

		AuthService.getUser()
			.then(function(data) {
				vm.user = data.data;
			});	
	});	

	vm.doLogin = function() {
		vm.processing = true;
		vm.error = '';

		AuthService.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;			

				if (data.success) {
                    currentUser.name = data
                    currentUser.userId = data
                    currentUser.role = data
					$location.path('/overview');
				} else {
					vm.error = data.message;
				}
				
			});
	};

	vm.doLogout = function() {
		AuthService.logout();
		vm.user = '';
		$location.path('/login');
	};

}]);
