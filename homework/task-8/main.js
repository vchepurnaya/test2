'use strict'

const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operation');
const deleteButton = document.querySelector('.delete');
const clearButton = document.querySelector('.clear');
const decimalButton = document.querySelector('.decimal');
const textArea = document.querySelector('.current-operand');

let memoryCurrentNumber = 0;
let memoryNewNumber = false;
let memoryPendingOperation = '';


function numberPress(number) {
    if (memoryNewNumber) {
        textArea.innerText = number;
        memoryNewNumber = false;
    } else {
        if (textArea.innerText === '0') {
            textArea.innerText = number
        } else {
            textArea.innerText += number
        }
    }
}

function operationPress(operator) {
    let localOperationMemory = textArea.innerText;

    if (memoryNewNumber && memoryPendingOperation !== '=') {
        textArea.innerText = memoryCurrentNumber;
    } else {
        memoryNewNumber = true;

        if (memoryPendingOperation === '+') {
            memoryCurrentNumber += parseFloat(localOperationMemory);

        } else if (memoryPendingOperation === '-') {
            memoryCurrentNumber -= parseFloat(localOperationMemory);
        } else if (memoryPendingOperation === '*') {
            memoryCurrentNumber *= parseFloat(localOperationMemory);

        } else if (memoryPendingOperation === '/') {
            memoryCurrentNumber /= parseFloat(localOperationMemory);
        } else {
            memoryCurrentNumber = parseFloat(localOperationMemory);
        }

        textArea.innerText = memoryCurrentNumber;
        memoryPendingOperation = operator;
    }
}

function decimalPress() {
    let localDecimalMemory = textArea.innerText;

    if (memoryNewNumber) {
        localDecimalMemory = '0.';
        memoryNewNumber = false;
    } else {
        if (localDecimalMemory.indexOf('.') === -1) {
            localDecimalMemory += '.';
        }
    }
    textArea.innerText = localDecimalMemory;
}

function clear(id) {
    if (id.toLowerCase() === 'del') {
        textArea.innerText = '0';
        memoryNewNumber = true;
    } else if (id.toLowerCase() === 'ac') {
        textArea.innerText = '0';
        memoryNewNumber = true;
        memoryCurrentNumber = 0;
        memoryPendingOperation = '';
    }
}

numberButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        numberPress(e.target.innerText);
    })
});

operationButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        operationPress(e.target.innerText);
    })
});

deleteButton.addEventListener('click', (e) => {
    clear(e.target.innerText);
});

clearButton.addEventListener('click', (e) => {
    clear(e.target.innerText);
});

decimalButton.addEventListener('click', decimalPress);
