angular.module('overviewCtrl', ['ngTouch', 'ui.grid'])

    .controller('overviewController', [function() {

        var vm = this;

        vm.test = 888;

        vm.mySelections = [];

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

        var def = [
            { field: 'UID', displayName: 'UID', visible: false },
            { field: 'creater'},
            { field: 'createDate'},
            { field: 'difficulty'},
            { field: 'myScore'},
            { field: 'myTime'},
            { field: 'myLastExecution'},
            {name: 'delete', displayName: 'Delete', cellTemplate: '<button id="deleteBtn" type="button" class="btn-small" ng-click="vm.copyLink(row.entity)" >Delete</button> '}
        ];

        vm.gridOptions = {
            data: data,
            columnDefs :  def
        };

        vm.copyLink = function (row) {

        };
    }]);