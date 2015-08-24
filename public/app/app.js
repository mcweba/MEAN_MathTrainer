
var app = angular.module('MathTrainer', ['app.routes','ngTouch', 'ui.grid']);


        app.controller('MainController', ['$scope', function ($scope) {

            $scope.myData = [
                {
                    "creater": "Peter",
                    "createDate": "12.05.2015",
                    "difficulty": 4,
                    "myScore": 3,
                    "myTime" : "00:12:34",
                    "myLastExecution" : "12.05.2015"
                },
                {
                    "creater": "Paul",
                    "createDate": "12.05.2015",
                    "difficulty": 4,
                    "myScore": 3,
                    "myTime" : "00:12:34",
                    "myLastExecution" : "12.05.2015"
                },
                {
                    "creater": "Marry",
                    "createDate": "12.05.2015",
                    "difficulty": 4,
                    "myScore": 3,
                    "myTime" : "00:12:34",
                    "myLastExecution" : "12.05.2015"
                }
            ];
        }]);
