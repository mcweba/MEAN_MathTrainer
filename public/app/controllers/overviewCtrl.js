angular.module('mathApp.overview', ['ngTouch', 'ui.grid'])

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
                "createDate": "11.07.2014",
                "difficulty": 2,
                "myScore": 1,
                "myTime" : "01:12:34",
                "myLastExecution" : "12.07.2015"
            },
            {
                "UID":"8D568A36-D583-42E7-A441-EE4F05592741",
                "creater": "Marry",
                "createDate": "02.08.2005",
                "difficulty": 9,
                "myScore": 8,
                "myTime" : "10:12:34",
                "myLastExecution" : "12.05.2015"
            }
        ];

        vm.editRow = function (grid, row) {

        };

        var def = [
            { field: 'UID', displayName: 'UID', visible: false },
            { field: 'creater'},
            { field: 'createDate'},
            { field: 'difficulty'},
            { field: 'myScore'},
            { field: 'myTime'},
            { field: 'myLastExecution'},
            { sortable: false, enableSorting : false,  enableFiltering: false,  name:'Link ',cellTemplate:'<div style="margin: 0px" ><button class="glyphicon glyphicon-plus" ng-click="grid.appScope.overview.editRow(grid, row)"></button></div>'}
        ];

        vm.gridOptions = {
            enableFiltering: true,
            data: data,
            columnDefs :  def
        };
    }]);