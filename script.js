const buttons = document.querySelectorAll('.calculator-button'),
  calculatorDisplay = document.querySelector('.calculator-display'),
  allClear = document.querySelector('.all-clear');

let result = null,
  firstOperand = null,
  operator = null,
  secondOperand = null,
  lastMove = null,
  lastNumber = null,
  expectClearTheLastMove = false,
  expectNextOperand = false;

class Calculator {
    constructor() {}
    
    plus(value, secondValue) {
        return (value * 10 + secondValue * 10) / 10;
    }
    
    minus(value, secondValue) {
        return value - secondValue;
    }
    
    multiply(value, secondValue) {
        return value * secondValue;
    }
    
    divide(value, secondValue) {
        if(secondValue !== 0) {
            return value / secondValue;
        } else {
            return 'Ошибка!'
        }
    }
    
    percent(value) {
        return value / 100;
    }
    
    toggleSign(value) {
        return -value
    }
    
    calculateResult(firstOperand, operator, secondOperand = null) {
        switch (operator) {
            case 'plus':
                return this.plus(firstOperand, secondOperand);
            case 'minus':
                return this.minus(firstOperand, secondOperand);
            case 'multiply':
                return this.multiply(firstOperand, secondOperand);
            case 'divide':
                return this.divide(firstOperand, secondOperand);
            case 'percent':
                return this.percent(firstOperand);
            case 'toggle-sign':
                return this.toggleSign(firstOperand);
            default:
                return firstOperand;
        }
    }
    
    allClear() {
        calculatorDisplay.textContent = '0';
        result = 0;
        firstOperand = null;
        operator = null;
        secondOperand = null;
        expectNextOperand = false;
        this.changeFontSize();
    }
    
    clearLastMove(lastMove) {
        if (lastMove === 'operator' || lastMove === 'unary') {
            operator = null;
            expectNextOperand = false;
            calculatorDisplay.textContent = lastNumber;
        } else {
            calculatorDisplay.textContent = '0';
        }
        
        expectClearTheLastMove = false;
        allClear.textContent = 'AC';
        this.changeFontSize();
    }
    
    changeFontSize() {
        let fontSize = 100;
        calculatorDisplay.style.fontSize = fontSize + 'px';
        
        while (calculatorDisplay.clientWidth < calculatorDisplay.scrollWidth) {
            fontSize -= 10;
            calculatorDisplay.style.fontSize = fontSize + 'px';
        }
    }
}

let calculator = new Calculator();

buttons.forEach(button => {
    button.addEventListener('click',(event) => {
        let value = button.textContent;
        
        if(button.classList.contains('numbers')) {
            if (Boolean(expectNextOperand || calculatorDisplay.textContent === '0')) {
                calculatorDisplay.textContent = value;
                expectNextOperand = false;
                expectClearTheLastMove = true;
                allClear.textContent = 'C';
                lastNumber = calculatorDisplay.textContent;
            } else {
                calculatorDisplay.textContent += value;
                lastNumber = calculatorDisplay.textContent;
            }
            
            lastMove = 'number';
            calculator.changeFontSize();
        }
        
        else if(button.classList.contains('arithmetic-operators')) {
            let nextOperator = button.id,
                nextOperand = parseFloat(calculatorDisplay.textContent);
            
            if(firstOperand === null) {
                firstOperand = nextOperand;
            } else if(operator && !expectNextOperand) {
                result = calculator.calculateResult(firstOperand, operator, nextOperand);
                calculatorDisplay.textContent = result;
                firstOperand = result;
                lastNumber = result;
            }
            
            operator = nextOperator;
            expectNextOperand = true;
            allClear.textContent = 'C';
            lastMove = 'operator';
            calculator.changeFontSize();
        }
        
        else if(button.classList.contains('unary-operators')) {
            operator = button.id;
            firstOperand = parseFloat(calculatorDisplay.textContent);
            result = calculator.calculateResult(firstOperand, operator);
            calculatorDisplay.textContent = result;
            firstOperand = result;
            lastMove = 'unary';
            calculator.changeFontSize();
        }
        
        else if(button.id === 'equal') {
            if(operator && firstOperand !== null) {
                secondOperand = parseFloat(calculatorDisplay.textContent);
                result = calculator.calculateResult(firstOperand, operator, secondOperand);
                calculatorDisplay.textContent = result;
                firstOperand = result;
                operator = null;
                lastMove = calculatorDisplay.textContent;
                calculator.changeFontSize();
            }
        }
        
        else if (button.id === 'all-clear') {
            if (allClear.textContent === 'AC') {
                calculator.allClear();
            } else {
                calculator.clearLastMove(lastMove);
            }
        }
    })
})
