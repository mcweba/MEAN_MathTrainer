var ctrl, ctrlScope, injector;

QUnit.module('CreateCalc', {

    beforeEach: function() {
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

    assert.strictEqual(ctrl.quantity,ctrl.calculations.length,'Test generate and add calculation');
});

QUnit.test('Test Addition', function(assert) {
    ctrl.quantity = 5;
    ctrl.number1Min = 3;
    ctrl.number1Max = 6;
    ctrl.number2Min = 7;
    ctrl.number2Max = 15;
    ctrl.selectedOption = ctrl.options[0];

    ctrl.generate();
    ctrl.addCalculation();

    assert.strictEqual(ctrl.quantity,ctrl.calculations.length,'Test Addition');
});

QUnit.test('Test Minus', function(assert) {
    ctrl.quantity = 5;
    ctrl.number1Min = 1;
    ctrl.number1Max = 6;
    ctrl.number2Min = 2;
    ctrl.number2Max = 6;
    ctrl.selectedOption = ctrl.options[1];

    ctrl.generate();
    ctrl.addCalculation();

    assert.strictEqual(ctrl.quantity,ctrl.calculations.length,'Test Minus');
});

QUnit.test('Test Multiplication', function(assert) {
    ctrl.quantity = 5;
    ctrl.number1Min = 3;
    ctrl.number1Max = 11;
    ctrl.number2Min = 3;
    ctrl.number2Max = 16;
    ctrl.selectedOption = ctrl.options[2];

    ctrl.generate();
    ctrl.addCalculation();

    assert.strictEqual(ctrl.quantity,ctrl.calculations.length,'Test Multiplication');
});

QUnit.test('Test Division', function(assert) {
    ctrl.quantity = 5;
    ctrl.number1Min = 1;
    ctrl.number1Max = 15;
    ctrl.number2Min = 1;
    ctrl.number2Max = 20;
    ctrl.selectedOption = ctrl.options[3];

    ctrl.generate();
    ctrl.addCalculation();

    assert.strictEqual(ctrl.quantity,ctrl.calculations.length,'Test Division');
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

    assert.strictEqual(0,ctrl.calculations.length,'Division by Zero');
});

QUnit.test('Delete calc', function(assert) {
    ctrl.quantity = 10;
    ctrl.number1Min = 1;
    ctrl.number1Max = 5;
    ctrl.number2Min = 5;
    ctrl.number2Max = 10;
    ctrl.selectedOption = ctrl.options[1];

    ctrl.generate();
    ctrl.addCalculation();

    // delete first calc
    ctrl.deleteCalc(0);

    // after delete we have quantity -1 calculations
    assert.strictEqual(ctrl.quantity-1,ctrl.calculations.length,'Test delete a calculation');
});