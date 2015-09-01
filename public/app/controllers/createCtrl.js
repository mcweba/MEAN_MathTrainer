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

        number1Max = vm.number1Max;
        number2Max = vm.number2Max;

        vm.options = [
            {name:'+'},
            {name:'-'},
            {name:'*'},
            {name:'/'}
        ];

        vm.difficultLevels =[
            {name: 'Einfach'},
            {name: 'Mittel'},
            {name: 'Schwer'}
        ];

        vm.selectedOption = vm.options[0];

        vm.selectedDifficultLevel = vm.difficultLevels[0];

        vm.calculations =[
            // example  {n1: 4, op: '*', n2: 3, res: 12}
            ];

        vm.preCalculations = "";

        vm.quantityChanged = function(){
            if(vm.quantity > 1000){
                vm.quantity = quantity;
            }else{
                quantity = vm.quantity;
            }
        };

        vm.number1MinChanged = function(){
            if(vm.number1Min >  vm.number1Max){
                number1Max = vm.number1Min;
                vm.number1Max = number1Max;
            }
        };

        vm.number1MaxChanged = function(){
            if(vm.number1Max < vm.number1Min){
                vm.number1Max = number1Max;
            }else{
                number1Max = vm.number1Max;
            }
        };

        vm.number2MinChanged = function(){
            if(vm.number2Min >  vm.number2Max){
                number2Max = vm.number2Min;
                vm.number2Max = number2Max;
            }
        };

        vm.number2MaxChanged = function(){
            if(vm.number2Max < vm.number2Min){
                vm.number2Max = number2Max;
            }else{
                number2Max = vm.number2Max;
            }
        };

        vm.generate = function(){
            vm.preCalculations = "";
            var result = "";
            for(var i=0;i<vm.quantity;i++) {
                 var number1 = Math.floor(Math.random() * (vm.number1Max+1 - vm.number1Min) + vm.number1Min);
                 var number2 =  Math.floor(Math.random() * (vm.number2Max+1 - vm.number2Min) + vm.number2Min);
                result += number1 + vm.selectedOption.name + number2 + separator;
            }
            vm.preCalculations += result;
        };

        vm.addCalculation = function(){
            var invalidCalcs = "";
            var prePosition = 0;
            for(var i=0;i<vm.preCalculations.length;i++) {
                var e = vm.preCalculations[i];
                if(e === separator){
                    var pattern = vm.preCalculations.substring(prePosition,i);
                    var number1 = parseInt(pattern);
                    var number2 = parseInt(pattern.substring(number1.toString().length + 1, pattern.length));
                    var operator = pattern.substring(number1.toString().length, number1.toString().length + 1);

                    // Validierung
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
                            vm.calculations.push({n1: number1, op:'/', n2: number2, res: number1 / number2});
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
            }else
            {
                vm.preCalculations = "";
            }

           // console.log(vm.preCalculations);
            console.log(vm.calculations);
        };

        vm.deleteCalc = function(idx) {
            vm.calculations.splice(idx, 1);
        };

        vm.submit = function() {
            /*   {
             diff_level: '1',
             calculations: [
             {n1: 4, op: '*', n2: 3, res: 12},
             {n1: 7, op: '+', n2: 1, res: 8}
             ]
             }*/
            var result ={
                diff_level: vm.difficultLevels.indexOf(vm.selectedDifficultLevel) + 1,
                calculations: vm.calculations
            };

            // call Service
            CalcService.submitCalcSet(result)
                .success(function(data) {
                    vm.calculations = [];
                    console.log(data);
            });
        };

    }]);