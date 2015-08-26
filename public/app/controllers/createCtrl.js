angular.module('createCtrl', [])

    .controller('createController', [function() {

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
        quantity

        vm.options = [
            {name:'+'},
            {name:'-'},
            {name:'*'},
            {name:'/'}
        ];

        vm.calculations =[
           // example {calc:'1+6'}
        ];

        vm.selectedOption = vm.options[0];

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
            var result = "";
            for(var i=0;i<vm.quantity;i++) {
                 var number1 = Math.floor(Math.random() * (vm.number1Max+1 - vm.number1Min) + vm.number1Min);
                 var number2 =  Math.floor(Math.random() * (vm.number2Max+1 - vm.number2Min) + vm.number2Min);
                result += number1 + vm.selectedOption.name + number2 + separator;
            }
            vm.preCalculations += result;
        };

        vm.addCalculation = function(){
            var prePosition = 0;
            for(var i=0;i<vm.preCalculations.length;i++) {
                var e = vm.preCalculations[i];
                if(e === separator){
                    var pattern = vm.preCalculations.substring(prePosition,i);
                   // console.log(pattern);
                    var number1 = parseInt(pattern);
                    var number2 = parseInt(pattern.substring(number1.toString().length + 1, pattern.length));
                    var operator = pattern.substring(number1.toString().length, number1.toString().length + 1);
                    if(operator === "+"){
                        vm.calculations.push({calc: pattern, total: number1 + number2});
                    }
                    if(operator === "-"){
                        vm.calculations.push({calc: pattern, total: number1 - number2});
                    }
                    if(operator === "*"){
                        vm.calculations.push({calc: pattern, total: number1 * number2});
                    }
                    if(operator === "/"){
                        vm.calculations.push({calc: pattern, total: number1 / number2});
                    }
                    prePosition = i+1;
            }            }
           // console.log(vm.preCalculations);
            console.log(vm.calculations);
        };
    }]);