
var app = angular.module('MathTrainer', ['app.routes','ngTouch', 'ui.grid']);


        app.controller('MainController', ['$scope', function ($scope) {
            $scope.mySelections = [];

            var data = [
                {
                    "UID":"8D568A36-D583-42E7-A441-EE4F05592741",
                    "creater": "Peter",
                    "createDate": "12.05.2015",
                    "difficulty": 4,
                    "myScore": 3,
                    "myTime" : "00:12:34",
                    "myLastExecution" : "12.05.2015"
                },
                {
                    "UID":"8D568A36-D583-42E7-A441-EE4F05592741",
                    "creater": "Paul",
                    "createDate": "12.05.2015",
                    "difficulty": 4,
                    "myScore": 3,
                    "myTime" : "00:12:34",
                    "myLastExecution" : "12.05.2015"
                },
                {
                    "UID":"8D568A36-D583-42E7-A441-EE4F05592741",
                    "creater": "Marry",
                    "createDate": "12.05.2015",
                    "difficulty": 4,
                    "myScore": 3,
                    "myTime" : "00:12:34",
                    "myLastExecution" : "12.05.2015"
                }
            ];

           var def = [{ field: 'UID', displayName: 'UID', visible: false },
               { field: 'creater'},
               { field: 'createDate'},
               { field: 'difficulty'},
               { field: 'myScore'},
               { field: 'myTime'},
               { field: 'myLastExecution'}
           ];

            $scope.gridOptions = {
                data: data,
                columnDefs :  def
            };

        }]);
