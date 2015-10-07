angular.module('mathApp.create', [])

    .controller('createController', ['CalcService', function(CalcService) {

        var vm = this;
        var quantity = 0;
        var number1Max = 0;
        var number2Max = 0;
        var separator = ";";

        vm.quantity = 0;
        vm.number1Min = 0;
        vm.number1Max = 0;
        vm.number2Min = 0;
        vm.number2Max = 0;
        vm.counter = 0;
        vm.isGenerateFeedback = false;
        vm.generateFeedback = '';
        vm.isSubmitFeedback = false;
        vm.name = '';

        number1Max = vm.number1Max;
        number2Max = vm.number2Max;

        vm.options = [
            {name:'+'},
            {name:'-'},
            {name:'*'},
            {name:'/'}
        ];

        vm.difficultLevels =[
            {name: 'Simple'},
            {name: 'Moderate'},
            {name: 'Difficult'}
        ];

        vm.selectedOption = vm.options[0];

        vm.selectedDifficultLevel = vm.difficultLevels[0];

        vm.calculations =[
            ];

        vm.preCalculations = "";

        vm.quantityChanged = function(){
            vm.cleanSubmitFeedback();
            if(vm.quantity > 1000){
                vm.quantity = quantity;
            }else{
                quantity = vm.quantity;
            }
        };

        vm.number1MinChanged = function(){
            vm.cleanSubmitFeedback();
            if(vm.number1Min >  vm.number1Max){
                number1Max = vm.number1Min;
                vm.number1Max = number1Max;
            }
        };

        vm.number1MaxChanged = function(){
            vm.cleanSubmitFeedback();
            if(vm.number1Max < vm.number1Min){
                vm.number1Max = number1Max;
            }else{
                number1Max = vm.number1Max;
            }
        };

        vm.number2MinChanged = function(){
            vm.cleanSubmitFeedback();
            if(vm.number2Min >  vm.number2Max){
                number2Max = vm.number2Min;
                vm.number2Max = number2Max;
            }
        };

        vm.number2MaxChanged = function(){
            vm.cleanSubmitFeedback();
            if(vm.number2Max < vm.number2Min){
                vm.number2Max = number2Max;
            }else{
                number2Max = vm.number2Max;
            }
        };

        vm.generate = function(){
            vm.cleanSubmitFeedback();
            vm.isGenerateFeedback = false;
            vm.generateFeedback = '';
            if(vm.quantity > 0 & vm.number2Max < 1 & vm.selectedOption.name === "/"){
                vm.generateFeedback = "Division by 0 is not permitted, please change range for 2nd number.";
                vm.preCalculations = '';
                vm.isGenerateFeedback = true;
            }else{
                vm.preCalculations = "";
                var result = "";
                for(var i=0;i<vm.quantity;i++) {
                    var number1 = Math.floor(Math.random() * (vm.number1Max+1 - vm.number1Min) + vm.number1Min);
                    var number2 =  Math.floor(Math.random() * (vm.number2Max+1 - vm.number2Min) + vm.number2Min);
                    if(vm.selectedOption.name === "/"){
                        if(number2 < 1){
                            number2 = 1;
                        }
                        var res = number1 / number2;
                        res = Math.ceil(res);
                        number1 = res * number2;
                        result += number1 + vm.selectedOption.name + number2 + separator;
                    }else{
                        result += number1 + vm.selectedOption.name + number2 + separator;
                    }
                }
                vm.preCalculations += result;
            }
        };

        vm.isDivisionValid = true;
        vm.validateDivision = function (nb1, nb2){
            vm.isDivisionValid = true;
            if(nb2 <= 0){
                vm.isDivisionValid = false;
                return;
            }
            var res1 = nb1 / nb2;
            var res2 = Math.floor(res1);
            if(res1 !== res2){
                vm.isDivisionValid = false;
            }
        };

        vm.addCalculation = function(){
            vm.cleanSubmitFeedback();
            var invalidCalcs = "";
            var hasInvalidDivision = false;
            var prePosition = 0;
            var lastChar = vm.preCalculations.substring(vm.preCalculations.length-1,vm.preCalculations.length);
            if(vm.preCalculations.length > 0 & lastChar != separator){
                vm.preCalculations += separator;
            }
            for(var i=0;i<vm.preCalculations.length;i++) {
                var e = vm.preCalculations[i];
                if(e === separator){
                    var pattern = vm.preCalculations.substring(prePosition,i);
                    var number1 = parseInt(pattern);
                    var number2 = parseInt(pattern.substring(number1.toString().length + 1, pattern.length));
                    var operator = pattern.substring(number1.toString().length, number1.toString().length + 1);

                    // validation
                    var patrLength = pattern.length;
                    var patr2Length = 0;
                    patr2Length += number1.toString().length;
                    patr2Length += number2.toString().length;
                    if(operator === "+" || operator === "-" || operator === "*" || operator === "/"){
                        patr2Length +=1;
                    }

                    if(patrLength === patr2Length){
                        if(operator === "+"){
                            vm.calculations.push({n1: number1, op:'+', n2: number2, res: number1 + number2});
                        }
                        if(operator === "-"){
                            vm.calculations.push({n1: number1, op:'-', n2: number2, res: number1 - number2});
                        }
                        if(operator === "*"){
                            vm.calculations.push({n1: number1, op:'*', n2: number2, res: number1 * number2});
                        }
                        if(operator === "/"){
                            vm.validateDivision(number1, number2);
                            if(vm.isDivisionValid){
                                vm.calculations.push({n1: number1, op: '/', n2: number2, res: number1 / number2});
                            }else{
                                hasInvalidDivision = true;
                                invalidCalcs += pattern + separator;
                            }
                        }
                        prePosition = i+1;
                    }else{
                        invalidCalcs += pattern + separator;
                        prePosition = i+1;
                    }
                }
            }
            if(invalidCalcs.length > 0){
                var invalid = "Invalid: ";
                if(vm.preCalculations.substring(0,invalid.length) === invalid){
                    vm.preCalculations = invalidCalcs;
                }else{
                    vm.preCalculations = invalid + invalidCalcs;
                }
                if(hasInvalidDivision){
                    vm.preCalculations += "\rDivision by 0 and divisions not resulting in integers are invalid.";
                }
            }else
            {
                vm.preCalculations = "";
            }
        };

        vm.deleteCalc = function(idx) {
            vm.calculations.splice(idx, 1);
        };

        vm.submit = function() {
            vm.cleanSubmitFeedback();
            if(vm.calculations.length > 0) {
                var result = {
                    name: vm.name,
                    diff_level: vm.difficultLevels.indexOf(vm.selectedDifficultLevel) + 1,
                    calculations: vm.calculations
                };

                // call Service
                CalcService.submitCalcSet(result)
                    .success(function (data) {
                        vm.calculations = [];
                        vm.name = '';
                        vm.isSubmitFeedback = true;
                        vm.submitFeedback = 'Arithmetics successfully created.';
                    });
            }
        };

        vm.cleanSubmitFeedback = function(){
            vm.isSubmitFeedback = false;
            vm.submitFeedback = '';
        };
    }]);