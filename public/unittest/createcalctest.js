var ctrl, ctrlScope, injector;

QUnit.module('CreateCalc', {

    beforeEach: function() {
        var appModule = angular.module('mathApp.create');
        injector = angular.injector(['ng', 'mathApp.create', 'mathApp.calcService']);
        ctrlScope = injector.get('$rootScope').$new();
        ctrl = injector.get('$controller')('createController', { $scope: ctrlScope });
    },
    afterEach: function() {
    }
});


QUnit.test('generate method', function(assert) {
    ctrl.quantity = 10;
    ctrl.number1Min = 1;
    ctrl.number1Max = 10;
    ctrl.number2Min = 5;
    ctrl.number2Max = 15;
    ctrl.selectedOption = ctrl.options[0];

    ctrl.generate();
    ctrl.addCalculation();

    assert.strictEqual(ctrl.quantity,ctrl.calculations.length,"Test generate and add calculation");
});

QUnit.test('Division by Zero', function(assert) {
    ctrl.quantity = 10;
    ctrl.number1Min = 1;
    ctrl.number1Max = 10;
    ctrl.number2Min = 0;
    ctrl.number2Max = 0;
    ctrl.selectedOption = ctrl.options[3];

    ctrl.generate();
    ctrl.addCalculation();

    assert.strictEqual(0,ctrl.calculations.length,"Division by Zero");
});