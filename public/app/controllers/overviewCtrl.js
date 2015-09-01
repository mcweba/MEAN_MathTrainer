angular.module('mathApp.overview', ['ngTouch', 'ui.grid', 'angular-clipboard','ngAnimate', 'ui.bootstrap'])

    .controller('overviewController', ['$modal',function ( $modal, $log) {
        var vm = this;
        vm.test = 888;
        vm.mySelections = [];

        vm.open1 = function (size) {

            var modalInstance = $modal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return vm.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                vm.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.toggleAnimation = function () {
            vm.animationsEnabled = !vm.animationsEnabled;
        };

        var data = [
            {
                "UID": "8D568A36-D583-42E7-A441-EE4F05592741",
                "creater": "Peter",
                "createDate": "12.05.2015",
                "difficulty": 4,
                "myScore": 3,
                "myTime": "00:12:34",
                "myLastExecution": "12.05.2015"
            },
            {
                "UID": "8D568A36-D583-42E7-A441-EE4F05592741",
                "creater": "Paul",
                "createDate": "11.07.2014",
                "difficulty": 2,
                "myScore": 1,
                "myTime": "01:12:34",
                "myLastExecution": "12.07.2015"
            },
            {
                "UID": "8D568A36-D583-42E7-A441-EE4F05592741",
                "creater": "Marry",
                "createDate": "02.08.2005",
                "difficulty": 9,
                "myScore": 8,
                "myTime": "10:12:34",
                "myLastExecution": "12.05.2015"
            }
        ];

        vm.copyLink = function (grid, row) {
            vm.textToCopy = 'I can copy by clicking!';
            var selectedUID = row.entity.UID;
            vm.open1('lg');

        };

        vm.success = function () {
            console.log('Copied!');
        };

        vm.fail = function (err) {
            console.error('Error!', err);
        };

        vm.startTraining = function (grid, row) {
        };


        vm.items = ['item1', 'item2', 'item3'];

        vm.animationsEnabled = true;



        var def = [
                {field: 'UID', displayName: 'UID', visible: false, enableHiding: false},
                {displayName: 'Erzeuger', field: 'creater', enableHiding: false},
                {displayName: 'Erzeugungsdatum', field: 'createDate', enableHiding: false},
                {displayName: 'Schwierigkeitsgrad', field: 'difficulty', enableHiding: false},
                {displayName: 'Meine erreichte Punktzahl', field: 'myScore', enableHiding: false},
                {displayName: 'Dauer', field: 'myTime', enableHiding: false},
                {displayName: 'Zuletzt am', field: 'myLastExecution', enableHiding: false},
                {
                    displayName: 'Link kopieren',
                    enableColumnMenu: false,
                    sortable: false,
                    enableSorting: false,
                    enableFiltering: false,
                    name: 'Link ',
                    cellTemplate: '<div class="text-center" style="margin: 0px" ><button clipboard on-copied="grid.appScope.overview.success()" on-error="grid.appScope.overview.fail(err)" class="glyphicon glyphicon-plus" ng-click="grid.appScope.overview.copyLink(grid, row)"></button></div>',
                    enableHiding: false
                },
                {
                    displayName: 'Starten',
                    enableColumnMenu: false,
                    sortable: false,
                    enableSorting: false,
                    enableFiltering: false,
                    name: 'Loesen ',
                    cellTemplate: '<div  class="text-center" style="margin: 0px" ><button class="glyphicon glyphicon-hourglass" ng-click="grid.appScope.overview.editRow(grid, row)"></button></div>',
                    enableHiding: false
                }
            ];

            vm.gridOptions = {
                enableHiding: false,
                enableFiltering: true,
                data: data,
                columnDefs: def
            };
        }
        ])        ;

angular.module('mathApp.overview').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});