/*
===========================================
CALCULATOR CORE LOGIC
===========================================

This module handles:
1. Mathematical operations
2. Calculator state management
3. Input validation and error handling
4. Expression parsing and evaluation

EDUCATIONAL CONCEPTS:
- Module pattern for organizing code
- State management in vanilla JS
- Input validation and error handling
- Mathematical operations with precision handling
*/

// Calculator state object - contains all the calculator's current state
const CalculatorState = {
    currentInput: '0',
    expression: '',
    fullExpression: [], // Array to store the complete expression [number, operator, number, operator, ...]
    operator: null,
    previousValue: null,
    waitingForNewInput: false,
    hasError: false
};

/*
EDUCATIONAL NOTE: Why use an object for state?
- Keeps all related data together
- Easy to reset or debug
- Can be extended easily (add themes, settings, etc.)
- Clear separation between state and behavior
*/

// Calculator operations object - contains all mathematical functions
const CalculatorOperations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '×': (a, b) => a * b,
    '÷': (a, b) => {
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return a / b;
    }
};

/*
EDUCATIONAL NOTE: Why separate operations into an object?
- Easy to add new operations (sin, cos, log, etc.)
- Each operation is a pure function (predictable, no side effects)
- Clear, testable code
- Follows Single Responsibility Principle
*/

// Main Calculator object that contains all calculator functionality
const Calculator = {
    
    /**
     * Reset calculator to initial state
     * WHAT: Clears all values and resets to "0"
     * WHY: Provides clean slate for new calculations
     * HOW: Resets state object properties to defaults
     */
    clear() {
        CalculatorState.currentInput = '0';
        CalculatorState.expression = '';
        CalculatorState.fullExpression = []; // Reset the full expression array
        CalculatorState.operator = null;
        CalculatorState.previousValue = null;
        CalculatorState.waitingForNewInput = false;
        CalculatorState.hasError = false;
        
        console.log('Calculator cleared', CalculatorState);
    },

    /**
     * Clear current entry only (like CE button)
     * WHAT: Clears current input but keeps expression
     * WHY: Allows fixing mistakes without starting over
     */
    clearEntry() {
        // If we're in the middle of building an expression and haven't entered a number yet
        if (CalculatorState.waitingForNewInput) {
            // Remove the last operator from fullExpression if it exists
            if (CalculatorState.fullExpression.length > 0) {
                CalculatorState.fullExpression.pop();
            }
        }
        CalculatorState.currentInput = '0';
        CalculatorState.waitingForNewInput = false;
        CalculatorState.hasError = false;
        
        // Rebuild the expression string from fullExpression
        CalculatorState.expression = CalculatorState.fullExpression.join(' ');
        
        console.log('Entry cleared', CalculatorState);
    },

    /**
     * Add a number to the current input
     * WHAT: Handles number input including decimals
     * WHY: Core input functionality with validation
     * HOW: String manipulation with validation rules
     */
    inputNumber(number) {
        console.log('🔢 NUMBER INPUT START:', { number, stateBefore: {...CalculatorState} });
        
        // If there's an error, clear it first
        if (CalculatorState.hasError) {
            this.clear();
        }

        // If previous calculation was completed, start fresh
        if (CalculatorState.expression.endsWith(' = ')) {
            this.clear();
        }

        // Handle decimal point
        if (number === '.') {
            // Don't allow multiple decimal points
            if (CalculatorState.currentInput.includes('.')) {
                console.log('🔢 Decimal rejected: already has decimal point');
                return;
            }
            // If waiting for new input and user types decimal, start with "0."
            if (CalculatorState.waitingForNewInput) {
                CalculatorState.currentInput = '0.';
                CalculatorState.waitingForNewInput = false;
                console.log('🔢 Decimal after operator: starting with "0."');
                return;
            }
        }

        // Start new input if waiting or if current input is "0"
        if (CalculatorState.waitingForNewInput || CalculatorState.currentInput === '0') {
            console.log('🔢 Starting new input (was waiting or was "0")');
            CalculatorState.currentInput = number === '.' ? '0.' : number;
            CalculatorState.waitingForNewInput = false;
        } else {
            // Append to current input
            console.log('🔢 Appending to existing input');
            CalculatorState.currentInput += number;
        }

        // Update expression display
        if (CalculatorState.fullExpression.length === 0) {
            CalculatorState.expression = CalculatorState.currentInput;
        } else {
            // Update the expression by joining fullExpression and adding current input
            CalculatorState.expression = [...CalculatorState.fullExpression, CalculatorState.currentInput].join(' ');
        }

        console.log('🔢 NUMBER INPUT END:', { number, stateAfter: {...CalculatorState} });
    },

    /**
     * Handle operator input (+, -, ×, ÷)
     * WHAT: Sets up operation and handles chaining
     * WHY: Core calculator functionality
     * HOW: State management with expression building
     */
    inputOperator(operator) {
        console.log('➕ OPERATOR INPUT START:', {
            operator,
            stateBefore: {
                currentInput: CalculatorState.currentInput,
                fullExpression: [...CalculatorState.fullExpression],
                waitingForNewInput: CalculatorState.waitingForNewInput,
                expression: CalculatorState.expression
            }
        });
        
        // If there's an error, don't allow operations
        if (CalculatorState.hasError) {
            console.log('➕ Operator rejected: calculator has error');
            return;
        }

        // If a calculation was just completed (expression ends with =)
        if (CalculatorState.expression.endsWith(' = ')) {
            // Start a new expression using the previous result
            CalculatorState.fullExpression = [CalculatorState.currentInput];
            CalculatorState.expression = CalculatorState.currentInput;
            console.log('➕ Starting new expression from previous result:', CalculatorState.currentInput);
        } else if (!CalculatorState.waitingForNewInput) {
            // Add the current number to the expression if we're not waiting for input
            CalculatorState.fullExpression.push(CalculatorState.currentInput);
            console.log('➕ Added number to expression:', CalculatorState.currentInput);
        }

        // If we're changing the operator (last entry was an operator)
        if (CalculatorState.waitingForNewInput && CalculatorState.fullExpression.length > 0 && 
            ['+', '-', '×', '÷'].includes(CalculatorState.fullExpression[CalculatorState.fullExpression.length - 1])) {
            // Replace the last operator
            CalculatorState.fullExpression[CalculatorState.fullExpression.length - 1] = operator;
            console.log('➕ Replaced last operator with:', operator);
        } else {
            // Add the new operator
            CalculatorState.fullExpression.push(operator);
            console.log('➕ Added new operator:', operator);
        }

        // Update the display expression
        CalculatorState.expression = CalculatorState.fullExpression.join(' ');
        
        // Set up for next input
        CalculatorState.waitingForNewInput = true;
        CalculatorState.operator = operator;

        console.log('➕ OPERATOR INPUT END:', {
            operator,
            stateAfter: {
                currentInput: CalculatorState.currentInput,
                fullExpression: [...CalculatorState.fullExpression],
                waitingForNewInput: CalculatorState.waitingForNewInput,
                expression: CalculatorState.expression
            }
        });
    },

    /**
     * Perform calculation and return result
     * WHAT: Executes the complete mathematical expression
     * WHY: Core calculation functionality with error handling
     * HOW: Uses operation functions with operator precedence
     */
    calculate() {
        console.log('🧮 CALCULATE START:', { 
            stateBefore: {
                currentInput: CalculatorState.currentInput,
                fullExpression: [...CalculatorState.fullExpression],
                waitingForNewInput: CalculatorState.waitingForNewInput,
                expression: CalculatorState.expression
            }
        });

        // If there's no expression to calculate
        if (CalculatorState.fullExpression.length === 0) {
            return parseFloat(CalculatorState.currentInput);
        }

        try {
            // Build the final expression array
            let finalExpression = [...CalculatorState.fullExpression];
            if (!CalculatorState.waitingForNewInput) {
                finalExpression.push(CalculatorState.currentInput);
            }
            console.log('🧮 Final expression before calculation:', finalExpression);

            // First pass: handle multiplication and division
            let i = 1;
            while (i < finalExpression.length - 1) {
                if (finalExpression[i] === '×' || finalExpression[i] === '÷') {
                    const prev = parseFloat(finalExpression[i - 1]);
                    const next = parseFloat(finalExpression[i + 1]);
                    const operation = CalculatorOperations[finalExpression[i]];
                    const result = operation(prev, next);
                    console.log(`🧮 Multiplication/Division step: ${prev} ${finalExpression[i]} ${next} = ${result}`);
                    
                    // Replace the three elements with the result
                    finalExpression.splice(i - 1, 3, result.toString());
                    console.log('🧮 Expression after M/D step:', finalExpression);
                    i = 1; // Reset to start checking from beginning
                } else {
                    i += 2;
                }
            }

            // Second pass: handle addition and subtraction
            i = 1;
            while (i < finalExpression.length - 1) {
                const prev = parseFloat(finalExpression[i - 1]);
                const next = parseFloat(finalExpression[i + 1]);
                const operation = CalculatorOperations[finalExpression[i]];
                const result = operation(prev, next);
                console.log(`🧮 Addition/Subtraction step: ${prev} ${finalExpression[i]} ${next} = ${result}`);
                
                // Replace the three elements with the result
                finalExpression.splice(i - 1, 3, result.toString());
                console.log('🧮 Expression after A/S step:', finalExpression);
                i = 1;
            }

            // Get the final result
            const result = parseFloat(finalExpression[0]);
            
            // Handle floating point precision issues
            const roundedResult = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
            
            // IMPORTANT: Create a copy of the original expression for display
            const displayExpression = [...CalculatorState.fullExpression];
            if (!CalculatorState.waitingForNewInput) {
                displayExpression.push(CalculatorState.currentInput);
            }
            
            // Update state with result
            CalculatorState.currentInput = roundedResult.toString();
            CalculatorState.expression = displayExpression.join(' ') + ' = ';
            CalculatorState.fullExpression = [];
            CalculatorState.operator = null;
            CalculatorState.previousValue = null;
            CalculatorState.waitingForNewInput = true;

            console.log('🧮 Final state:', {
                result: roundedResult,
                displayExpression: displayExpression,
                expression: CalculatorState.expression,
                currentInput: CalculatorState.currentInput
            });
            return roundedResult;

        } catch (error) {
            // Handle errors (like division by zero)
            console.error('Calculation error:', error.message);
            this.setError(error.message);
            return null;
        }
    },

    /**
     * Set error state
     * WHAT: Handles error display and state
     * WHY: Graceful error handling for user experience
     */
    setError(message) {
        CalculatorState.hasError = true;
        CalculatorState.currentInput = message;
        CalculatorState.expression = 'Error';
        console.log('Error set:', message);
    },

    /**
     * Get current calculator state
     * WHAT: Returns current state for display updates
     * WHY: Separation of concerns - state vs display
     */
    getState() {
        return { ...CalculatorState }; // Return a copy to prevent external modification
    },

    /**
     * Get formatted expression for display
     * WHAT: Returns user-friendly expression string
     * WHY: Display formatting separate from internal state
     */
    getDisplayExpression() {
        if (CalculatorState.hasError) {
            return 'Error';
        }
        
        if (CalculatorState.expression === '') {
            return '';
        }
        
        return CalculatorState.expression;
    },

    /**
     * Get current result for display
     * WHAT: Returns current input/result for main display
     * WHY: Clear separation between expression and result
     */
    getDisplayResult() {
        return CalculatorState.currentInput;
    },

    /**
     * Toggle sign of current number (+/-)
     * WHAT: Changes positive numbers to negative and vice versa
     * WHY: Essential calculator function for handling negative numbers
     * HOW: Multiply current number by -1
     * 
     * EDUCATIONAL NOTE: Unary Operations
     * This is a "unary" operation because it operates on ONE number, unlike
     * binary operations (+, -, ×, ÷) that work on TWO numbers.
     */
    toggleSign() {
        console.log('🔄 TOGGLE SIGN START:', { currentInput: CalculatorState.currentInput });
        
        // Don't operate on error states
        if (CalculatorState.hasError) {
            console.log('🔄 Sign toggle rejected: calculator has error');
            return;
        }
        
        // Don't operate on zero (0 and -0 are functionally the same)
        if (CalculatorState.currentInput === '0' || CalculatorState.currentInput === '0.') {
            console.log('🔄 Sign toggle rejected: current input is zero');
            return;
        }
        
        // Toggle the sign
        if (CalculatorState.currentInput.startsWith('-')) {
            // Remove negative sign
            CalculatorState.currentInput = CalculatorState.currentInput.substring(1);
        } else {
            // Add negative sign
            CalculatorState.currentInput = '-' + CalculatorState.currentInput;
        }
        
        // Update expression if we're building one
        if (CalculatorState.fullExpression.length > 0 && !CalculatorState.waitingForNewInput) {
            // Update the expression display with the new signed number
            CalculatorState.expression = [...CalculatorState.fullExpression, CalculatorState.currentInput].join(' ');
        } else if (CalculatorState.fullExpression.length === 0) {
            // Update simple expression display
            CalculatorState.expression = CalculatorState.currentInput;
        }
        
        console.log('🔄 TOGGLE SIGN END:', { 
            currentInput: CalculatorState.currentInput,
            expression: CalculatorState.expression
        });
    },

    /**
     * Convert current number to percentage
     * WHAT: Converts number to its percentage equivalent (divide by 100)
     * WHY: Essential for percentage calculations in real-world scenarios
     * HOW: Parse number, divide by 100, format appropriately
     * 
     * MATHEMATICAL CONCEPT: Percentage Conversion
     * - 50% = 50 ÷ 100 = 0.5
     * - 25% = 25 ÷ 100 = 0.25
     * - 150% = 150 ÷ 100 = 1.5
     * This allows calculations like: 200 × 25% = 200 × 0.25 = 50
     */
    percentage() {
        console.log('📊 PERCENTAGE START:', { currentInput: CalculatorState.currentInput });
        
        // Don't operate on error states
        if (CalculatorState.hasError) {
            console.log('📊 Percentage rejected: calculator has error');
            return;
        }
        
        // Parse the current number
        const currentNumber = parseFloat(CalculatorState.currentInput);
        
        // Check for valid number
        if (isNaN(currentNumber)) {
            console.log('📊 Percentage rejected: current input is not a valid number');
            return;
        }
        
        // Convert to percentage (divide by 100)
        const percentageResult = currentNumber / 100;
        
        // Format the result to avoid floating point precision issues
        // Use up to 10 decimal places, then remove trailing zeros
        let formattedResult = percentageResult.toFixed(10).replace(/\.?0+$/, '');
        
        // Handle very small numbers that might round to 0
        if (formattedResult === '0' && percentageResult !== 0) {
            formattedResult = percentageResult.toString();
        }
        
        CalculatorState.currentInput = formattedResult;
        
        // Update expression if we're building one
        if (CalculatorState.fullExpression.length > 0 && !CalculatorState.waitingForNewInput) {
            // Update the expression display with the percentage result
            CalculatorState.expression = [...CalculatorState.fullExpression, CalculatorState.currentInput].join(' ');
        } else if (CalculatorState.fullExpression.length === 0) {
            // Update simple expression display
            CalculatorState.expression = CalculatorState.currentInput;
        }
        
        console.log('📊 PERCENTAGE END:', { 
            originalNumber: currentNumber,
            percentageResult: percentageResult,
            formattedResult: formattedResult,
            currentInput: CalculatorState.currentInput,
            expression: CalculatorState.expression
        });
    },

    /**
     * 🧪 TEST FUNCTION - Debug calculation sequences
     * WHAT: Tests specific calculation sequences for debugging
     * WHY: Helps verify fixes and understand calculator flow
     * HOW: Simulates button presses and logs detailed state changes
     */
    testCalculation(sequence, expectedExpression, expectedResult) {
        console.log('🧪 TESTING CALCULATION:', sequence.join(' → '));
        console.log('🧪 Expected Expression:', expectedExpression);
        console.log('🧪 Expected Result:', expectedResult);
        console.log('🧪 ========================================');
        
        // Clear calculator first
        this.clear();
        
        // Process each input in sequence
        for (let i = 0; i < sequence.length; i++) {
            const input = sequence[i];
            console.log(`🧪 Step ${i + 1}: Input "${input}"`);
            
            if (['+', '-', '×', '÷'].includes(input)) {
                this.inputOperator(input);
            } else if (input === '=') {
                this.calculate();
            } else if (input === '+/-') {
                this.toggleSign();
            } else if (input === '%') {
                this.percentage();
            } else {
                this.inputNumber(input);
            }
            
            console.log(`🧪 After step ${i + 1}:`, {
                expression: this.getDisplayExpression(),
                result: this.getDisplayResult(),
                state: {...CalculatorState}
            });
            console.log('🧪 ----------------------------------------');
        }
        
        // Check results
        const actualExpression = this.getDisplayExpression();
        const actualResult = this.getDisplayResult();
        
        console.log('🧪 FINAL RESULTS:');
        console.log('🧪 Expected Expression:', expectedExpression);
        console.log('🧪 Actual Expression:  ', actualExpression);
        console.log('🧪 Expression Match:   ', actualExpression === expectedExpression ? '✅' : '❌');
        console.log('🧪 Expected Result:    ', expectedResult);
        console.log('🧪 Actual Result:      ', actualResult);
        console.log('🧪 Result Match:       ', actualResult === expectedResult ? '✅' : '❌');
        console.log('🧪 ========================================\n');
        
        return {
            sequence,
            expectedExpression,
            expectedResult,
            actualExpression,
            actualResult,
            expressionMatch: actualExpression === expectedExpression,
            resultMatch: actualResult === expectedResult,
            success: actualExpression === expectedExpression && actualResult === expectedResult
        };
    }
};

/*
EDUCATIONAL NOTE: Module Pattern Benefits
This approach provides:
1. Encapsulation - state is contained within the module
2. Clear API - only necessary methods are exposed
3. Testability - each function has a clear purpose
4. Extensibility - easy to add new operations or features

For future features, you could add:
- Scientific operations (sin, cos, tan, log, etc.)
- Memory functions (M+, M-, MR, MC)
- Unit conversions
- Complex number support
- Expression validation and parsing improvements

COMMON BEGINNER MISTAKES I'M AVOIDING:
1. Using eval() for calculations (security risk)
2. Not handling floating point precision
3. No error handling for edge cases
4. Mixing display logic with calculation logic
5. Global variables without structure
6. No input validation
*/

/**
 * 🧪 RUN ALL TESTS - Comprehensive test suite
 * WHAT: Tests all the scenarios you mentioned to verify the fix
 * WHY: Ensures the bug is completely resolved
 * HOW: Runs multiple test cases and reports results
 */
function runCalculatorTests() {
    console.log('🧪 🧪 🧪 RUNNING COMPREHENSIVE CALCULATOR TESTS 🧪 🧪 🧪');
    
    const testCases = [
        // Original bug case
        {
            sequence: ['2', '+', '1', '='],
            expectedExpression: '2 + 1 = ',
            expectedResult: '3',
            description: 'Original bug case: 2 + 1'
        },
        
        // Simple operations
        {
            sequence: ['8', '-', '5', '='],
            expectedExpression: '8 - 5 = ',
            expectedResult: '3',
            description: 'Simple subtraction: 8 - 5'
        },
        
        {
            sequence: ['6', '×', '2', '='],
            expectedExpression: '6 × 2 = ',
            expectedResult: '12',
            description: 'Simple multiplication: 6 × 2'
        },
        
        {
            sequence: ['9', '÷', '3', '='],
            expectedExpression: '9 ÷ 3 = ',
            expectedResult: '3',
            description: 'Simple division: 9 ÷ 3'
        },
        
        // Chain calculations
        {
            sequence: ['2', '+', '3', '+', '4', '='],
            expectedExpression: '5 + 4 = ',
            expectedResult: '9',
            description: 'Chain addition: 2 + 3 + 4'
        },
        
        // Multi-digit numbers
        {
            sequence: ['1', '5', '+', '2', '7', '='],
            expectedExpression: '15 + 27 = ',
            expectedResult: '42',
            description: 'Multi-digit: 15 + 27'
        },
        
        // Decimal operations
        {
            sequence: ['3', '.', '5', '+', '1', '.', '5', '='],
            expectedExpression: '3.5 + 1.5 = ',
            expectedResult: '5',
            description: 'Decimal calculation: 3.5 + 1.5'
        },

        // NEW FEATURE TESTS: +/- Toggle Sign Tests
        {
            sequence: ['2', '5', '+/-'],
            expectedExpression: '-25',
            expectedResult: '-25',
            description: 'Toggle positive to negative: 25 → -25'
        },
        
        {
            sequence: ['1', '0', '+/-', '+/-'],
            expectedExpression: '10',
            expectedResult: '10',
            description: 'Double toggle returns to positive: 10 → -10 → 10'
        },
        
        {
            sequence: ['3', '+/-', '+', '2', '='],
            expectedExpression: '-3 + 2 = ',
            expectedResult: '-1',
            description: 'Negative number in calculation: -3 + 2'
        },
        
        {
            sequence: ['8', '-', '5', '+/-', '='],
            expectedExpression: '8 - -5 = ',
            expectedResult: '13',
            description: 'Toggle sign during expression: 8 - (-5)'
        },

        // NEW FEATURE TESTS: % Percentage Tests
        {
            sequence: ['5', '0', '%'],
            expectedExpression: '0.5',
            expectedResult: '0.5',
            description: 'Basic percentage: 50% = 0.5'
        },
        
        {
            sequence: ['2', '5', '%'],
            expectedExpression: '0.25',
            expectedResult: '0.25',
            description: 'Percentage conversion: 25% = 0.25'
        },
        
        {
            sequence: ['2', '0', '0', '×', '2', '5', '%', '='],
            expectedExpression: '200 × 0.25 = ',
            expectedResult: '50',
            description: 'Percentage in calculation: 200 × 25% = 50'
        },
        
        {
            sequence: ['1', '5', '0', '%'],
            expectedExpression: '1.5',
            expectedResult: '1.5',
            description: 'Percentage over 100: 150% = 1.5'
        },

        // COMBINED FEATURES TESTS
        {
            sequence: ['7', '5', '%', '+/-'],
            expectedExpression: '-0.75',
            expectedResult: '-0.75',
            description: 'Combined: percentage then toggle sign: 75% → -0.75'
        }
    ];
    
    let passedTests = 0;
    let totalTests = testCases.length;
    
    testCases.forEach((testCase, index) => {
        console.log(`\n🧪 TEST ${index + 1}: ${testCase.description}`);
        const result = Calculator.testCalculation(
            testCase.sequence, 
            testCase.expectedExpression, 
            testCase.expectedResult
        );
        
        if (result.success) {
            passedTests++;
            console.log(`✅ TEST ${index + 1} PASSED`);
        } else {
            console.log(`❌ TEST ${index + 1} FAILED`);
        }
    });
    
    console.log('\n🧪 ========== TEST SUMMARY ==========');
    console.log(`🧪 Total Tests: ${totalTests}`);
    console.log(`🧪 Passed: ${passedTests}`);
    console.log(`🧪 Failed: ${totalTests - passedTests}`);
    console.log(`🧪 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('🎉 ALL TESTS PASSED! Calculator is working correctly! 🎉');
    } else {
        console.log('⚠️  Some tests failed. Check the logs above for details.');
    }
    
    console.log('🧪 ===================================\n');
    
    return {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: Math.round((passedTests / totalTests) * 100)
    };
}

// Export for use in other modules (in a real module system, you'd use export/import)
// For our browser-based approach, Calculator is now available globally

/**
 * 🧪 TEST NEW FEATURES - Focused test for +/- and % operations
 * WHAT: Tests specifically the new unary operations we just added
 * WHY: Quick verification that new features work correctly
 * HOW: Runs targeted test cases for +/- and % operations
 */
function testNewFeatures() {
    console.log('🧪 🆕 TESTING NEW FEATURES: +/- AND % OPERATIONS 🆕 🧪');
    
    const newFeatureTests = [
        // +/- Tests
        {
            sequence: ['2', '5', '+/-'],
            expectedExpression: '-25',
            expectedResult: '-25',
            description: '✨ +/- Feature: 25 → -25'
        },
        
        {
            sequence: ['3', '+/-', '+', '2', '='],
            expectedExpression: '-3 + 2 = ',
            expectedResult: '-1',
            description: '✨ +/- in Expression: -3 + 2'
        },
        
        // % Tests
        {
            sequence: ['5', '0', '%'],
            expectedExpression: '0.5',
            expectedResult: '0.5',
            description: '✨ % Feature: 50% = 0.5'
        },
        
        {
            sequence: ['2', '0', '0', '×', '2', '5', '%', '='],
            expectedExpression: '200 × 0.25 = ',
            expectedResult: '50',
            description: '✨ % in Calculation: 200 × 25% = 50'
        },
        
        // Combined
        {
            sequence: ['7', '5', '%', '+/-'],
            expectedExpression: '-0.75',
            expectedResult: '-0.75',
            description: '✨ Combined: 75% → +/- = -0.75'
        }
    ];
    
    let passedTests = 0;
    let totalTests = newFeatureTests.length;
    
    newFeatureTests.forEach((testCase, index) => {
        console.log(`\n🧪 NEW FEATURE TEST ${index + 1}: ${testCase.description}`);
        const result = Calculator.testCalculation(
            testCase.sequence, 
            testCase.expectedExpression, 
            testCase.expectedResult
        );
        
        if (result.success) {
            passedTests++;
            console.log(`✅ TEST ${index + 1} PASSED`);
        } else {
            console.log(`❌ TEST ${index + 1} FAILED`);
        }
    });
    
    console.log('\n🧪 ======= NEW FEATURES TEST SUMMARY =======');
    console.log(`🧪 Total New Feature Tests: ${totalTests}`);
    console.log(`🧪 Passed: ${passedTests}`);
    console.log(`🧪 Failed: ${totalTests - passedTests}`);
    console.log(`🧪 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('🎉 ALL NEW FEATURES WORKING PERFECTLY! 🎉');
        console.log('✨ +/- toggle sign function implemented successfully!');
        console.log('✨ % percentage function implemented successfully!');
    } else {
        console.log('⚠️  Some new feature tests failed. Check the logs above.');
    }
    
    console.log('🧪 ==========================================\n');
    
    return {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: Math.round((passedTests / totalTests) * 100)
    };
}

// Make test runner available globally for easy debugging
window.runCalculatorTests = runCalculatorTests;
window.testNewFeatures = testNewFeatures;
window.testCalc = (sequence, expectedExpression, expectedResult) => {
    return Calculator.testCalculation(sequence, expectedExpression, expectedResult);
};

console.log('Calculator module loaded');
console.log('🧪 Debug functions available:');
console.log('  - runCalculatorTests() - Run all test cases');
console.log('  - testNewFeatures() - Test new +/- and % features');
console.log('  - testCalc(sequence, expectedExpression, expectedResult) - Test single case'); 