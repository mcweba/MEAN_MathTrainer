angular.module('mathApp.user', ['userService'])

    .controller('userController', ['UserService', 'currentUser', 'AuthService', '$location', function (UserService, currentUser, AuthService, $location) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        if (currentUser.role !== "admin") {
            AuthService.logout();
            vm.user = '';
            $location.path('/login');
        }

        // grab all the users at page load
        UserService.all()
            .success(function (data) {

                // when all the users come back, remove the processing variable
                vm.processing = false;

                // bind the users that come back to vm.users
                vm.users = data;
            });

        // function to delete a user
        vm.deleteUser = function (id) {
            vm.processing = true;

            UserService.delete(id)
                .success(function (data) {

                    // get all users to update the table
                    // you can also set up your api
                    // to return the list of users with the delete call
                    UserService.all()
                        .success(function (data) {
                            vm.processing = false;
                            vm.users = data;
                        });

                });
        };
        vm.doLogout = function () {

        };
    }])

// controller applied to user creation page
    .controller('userCreateController', ['UserService', function (UserService) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create a user
        vm.saveUser = function () {
            vm.processing = true;
            vm.message = '';

            // use the create function in the userService
            UserService.create(vm.userData)
                .success(function (data) {
                    vm.processing = false;
                    vm.userData = {};
                    vm.message = data.message;
                });

        };

    }])

// controller applied to user edit page
    .controller('userEditController', ['$routeParams', 'UserService', function ($routeParams, UserService) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';

        // get the user data for the user you want to edit
        // $routeParams is the way we grab data from the URL
        UserService.get($routeParams.user_id)
            .success(function (data) {
                vm.userData = data;
            });

        // function to save the user
        vm.saveUser = function () {
            vm.processing = true;
            vm.message = '';

            // call the userService function to update
            UserService.update($routeParams.user_id, vm.userData)
                .success(function (data) {
                    vm.processing = false;

                    // clear the form
                    vm.userData = {};

                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
        };

    }]);