/*
===========================================
MAIN APPLICATION MODULE
===========================================

This module handles:
1. Application initialization
2. Event handling and user interactions
3. Coordination between all modules
4. Keyboard shortcuts and accessibility

EDUCATIONAL CONCEPTS:
- Application architecture and initialization
- Event handling with event delegation
- Module coordination and data flow
- Keyboard accessibility
- Error handling and graceful degradation
*/

/**
 * Main Application object
 * WHAT: Central controller for the entire calculator application
 * WHY: Coordinates all modules and handles user interactions
 * HOW: Initializes modules, sets up event listeners, manages app state
 */
const CalculatorApp = {

    // Application state
    isInitialized: false,

    /**
     * Initialize the entire application
     * WHAT: Sets up all modules and event handlers
     * WHY: Central initialization ensures everything loads in correct order
     * HOW: Calls module init functions and sets up global event handlers
     */
    init() {
        console.log('Initializing Calculator App...');

        // Initialize all modules in dependency order
        if (!this.initializeModules()) {
            console.error('Failed to initialize modules');
            this.showError('Application failed to load. Please refresh the page.');
            return false;
        }

        // Set up event handlers
        this.setupEventHandlers();
        
        // Set up keyboard shortcuts
        this.setupKeyboardHandlers();

        // Initial display update
        DisplayManager.update();

        this.isInitialized = true;
        console.log('Calculator App initialized successfully');
        return true;
    },

    /**
     * Initialize all application modules
     * WHAT: Calls initialization functions for each module
     * WHY: Ensures all modules are ready before user interaction
     * HOW: Calls init functions and checks for success
     */
    initializeModules() {
        try {
            // Initialize display module first (required by others)
            if (!initializeDisplay()) {
                throw new Error('Display module failed to initialize');
            }

            // Initialize memory module
            if (!initializeMemory()) {
                throw new Error('Memory module failed to initialize');
            }

            console.log('All modules initialized successfully');
            return true;

        } catch (error) {
            console.error('Module initialization failed:', error);
            return false;
        }
    },

    /**
     * Set up all event handlers for user interactions
     * WHAT: Adds click handlers to calculator buttons
     * WHY: Enables user interaction with the calculator
     * HOW: Uses event delegation for performance and maintainability
     */
    setupEventHandlers() {
        // Get button container for event delegation
        const buttonGrid = document.querySelector('.button-grid');
        if (!buttonGrid) {
            console.error('Button grid not found!');
            return;
        }

        // Use event delegation - one listener handles all button clicks
        buttonGrid.addEventListener('click', (event) => {
            const button = event.target.closest('.btn');
            if (!button) return;

            this.handleButtonClick(button);
        });

        // Set up memory panel button handlers
        this.setupMemoryHandlers();

        console.log('Event handlers set up');
    },

    /**
     * Handle individual button clicks
     * WHAT: Routes button clicks to appropriate calculator functions
     * WHY: Central handler for all calculator operations
     * HOW: Uses data attributes to determine action type
     */
    handleButtonClick(button) {
        if (!this.isInitialized) return;

        // Get button data
        const number = button.getAttribute('data-number');
        const operator = button.getAttribute('data-operator');
        const action = button.getAttribute('data-action');

        // Visual feedback - button press animation
        this.animateButtonPress(button);

        // Route to appropriate handler
        if (number !== null) {
            this.handleNumberInput(number);
        } else if (operator) {
            this.handleOperatorInput(operator);
        } else if (action) {
            this.handleActionInput(action);
        }

        // Update display after any input
        DisplayManager.update();
    },

    /**
     * Handle number input
     * WHAT: Processes number and decimal point input
     * WHY: Core calculator functionality
     */
    handleNumberInput(number) {
        Calculator.inputNumber(number);
        console.log('Number input:', number);
    },

    /**
     * Handle operator input
     * WHAT: Processes mathematical operator input
     * WHY: Core calculator functionality
     */
    handleOperatorInput(operator) {
        Calculator.inputOperator(operator);
        console.log('Operator input:', operator);
    },

    /**
     * Handle action input (clear, equals, memory, etc.)
     * WHAT: Processes special action buttons
     * WHY: Additional calculator functionality
     * HOW: Switch statement to route to appropriate functions
     */
    handleActionInput(action) {
        switch (action) {
            case 'clear-all':
                Calculator.clear();
                DisplayManager.clear();
                console.log('Calculator cleared');
                break;

            case 'clear-entry':
                Calculator.clearEntry();
                console.log('Entry cleared');
                break;

            case 'calculate':
                const expression = Calculator.getDisplayExpression();
                const result = Calculator.calculate();
                
                // Add to history if calculation was successful
                if (result !== null && expression && !Calculator.getState().hasError) {
                    MemoryManager.addCalculation(expression, result);
                }
                console.log('Calculation performed');
                break;

            case 'toggle-memory':
                MemoryManager.togglePanel();
                console.log('Memory panel toggled');
                break;

            case 'clear-memory':
                MemoryManager.clearHistory();
                console.log('Memory cleared');
                break;

            case 'toggle-sign':
                Calculator.toggleSign();
                console.log('Sign toggled');
                break;

            case 'percentage':
                Calculator.percentage();
                console.log('Percentage applied');
                break;

            default:
                console.warn('Unknown action:', action);
        }
    },

    /**
     * Set up memory panel specific handlers
     * WHAT: Adds event handlers for memory panel interactions
     * WHY: Memory panel has specific interaction patterns
     */
    setupMemoryHandlers() {
        // Memory panel is already set up in memory.js
        // This is where we could add additional memory-related handlers
        console.log('Memory handlers set up');
    },

    /**
     * Set up keyboard shortcuts
     * WHAT: Enables keyboard input for calculator
     * WHY: Accessibility and user convenience
     * HOW: Maps keyboard events to calculator functions
     */
    setupKeyboardHandlers() {
        document.addEventListener('keydown', (event) => {
            // Don't interfere if user is typing in an input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            this.handleKeyboardInput(event);
        });

        console.log('Keyboard handlers set up');
    },

    /**
     * Handle keyboard input
     * WHAT: Maps keyboard keys to calculator operations
     * WHY: Keyboard accessibility and power user efficiency
     * HOW: Key mapping with event.key property
     */
    handleKeyboardInput(event) {
        const key = event.key;

        // Prevent default for calculator keys
        const calculatorKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                              '.', '+', '-', '*', '/', '=', 'Enter', 'Escape', 'Backspace', 'F9', '%'];
        
        if (calculatorKeys.includes(key)) {
            event.preventDefault();
        }

        // Map keys to calculator functions
        switch (key) {
            // Numbers
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
            case '.':
                this.handleNumberInput(key);
                break;

            // Operators
            case '+':
                this.handleOperatorInput('+');
                break;
            case '-':
                this.handleOperatorInput('-');
                break;
            case '*':
                this.handleOperatorInput('×');
                break;
            case '/':
                this.handleOperatorInput('÷');
                break;

            // Actions
            case '=':
            case 'Enter':
                this.handleActionInput('calculate');
                break;
            case 'Escape':
                this.handleActionInput('clear-all');
                break;
            case 'Backspace':
                this.handleActionInput('clear-entry');
                break;

            // Memory shortcuts
            case 'm':
            case 'M':
                this.handleActionInput('toggle-memory');
                break;

            // Unary operations
            case 'F9':  // Standard Windows calculator shortcut for +/-
                this.handleActionInput('toggle-sign');
                break;
            case '%':
                this.handleActionInput('percentage');
                break;

            default:
                // Key not handled
                return;
        }

        // Update display for handled keys
        DisplayManager.update();
        
        console.log('Keyboard input:', key);
    },

    /**
     * Animate button press for visual feedback
     * WHAT: Adds visual feedback when buttons are pressed
     * WHY: Improves user experience with immediate feedback
     * HOW: Temporarily adds CSS class with animation
     */
    animateButtonPress(button) {
        // Add pressed class
        button.classList.add('pressed');
        
        // Remove after short delay
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 150);
    },

    /**
     * Show application error
     * WHAT: Displays error message to user
     * WHY: Graceful error handling for better UX
     */
    showError(message) {
        // For now, just use alert - in a real app you'd have a proper error UI
        alert('Calculator Error: ' + message);
        console.error('App Error:', message);
    },

    /**
     * Get application state for debugging
     * WHAT: Returns current application state
     * WHY: Useful for debugging and development
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            calculatorState: Calculator.getState(),
            memoryHistory: MemoryManager.getHistory(),
            memoryVisible: MemoryManager.isVisible()
        };
    }
};

/*
EDUCATIONAL NOTE: Application Architecture
This structure demonstrates several important concepts:

1. INITIALIZATION ORDER: 
   - Modules are initialized in dependency order
   - Error handling ensures graceful failure

2. EVENT DELEGATION:
   - One event listener handles all button clicks
   - More efficient than individual listeners
   - Works with dynamically added content

3. SEPARATION OF CONCERNS:
   - App.js handles coordination
   - Individual modules handle their specific logic
   - Clear boundaries between responsibilities

4. KEYBOARD ACCESSIBILITY:
   - Full keyboard support for calculator operations
   - Prevents conflicts with other page elements
   - Standard key mappings users expect

5. ERROR HANDLING:
   - Graceful degradation when modules fail
   - User-friendly error messages
   - Console logging for debugging
*/

/*
FUTURE EXTENSIONS you could add:
- Settings persistence (themes, preferences)
- Undo/redo functionality
- Copy/paste support
- Scientific calculator mode
- Unit conversion features
- Expression validation and suggestions
- Touch gesture support
- Progressive Web App features
*/

// Add button press animation CSS
const buttonAnimationStyle = document.createElement('style');
buttonAnimationStyle.textContent = `
.btn.pressed {
    transform: scale(0.95);
    transition: transform 0.1s ease;
}
`;
document.head.appendChild(buttonAnimationStyle);

/*
EDUCATIONAL NOTE: Common Beginner Mistakes I'm Avoiding

1. GLOBAL VARIABLES EVERYWHERE
   ❌ let result = 0; let operator = '';
   ✅ Organized state in modules with clear boundaries

2. MIXING CONCERNS
   ❌ Calculator logic mixed with DOM manipulation
   ✅ Separate modules for logic, display, and memory

3. NO ERROR HANDLING
   ❌ Assuming everything will work perfectly
   ✅ Try/catch blocks and graceful degradation

4. INEFFICIENT EVENT HANDLING
   ❌ Adding listeners to every button individually
   ✅ Event delegation for better performance

5. NO KEYBOARD SUPPORT
   ❌ Mouse-only interface
   ✅ Full keyboard accessibility

6. HARD TO EXTEND
   ❌ Monolithic code that's difficult to modify
   ✅ Modular structure that's easy to extend
*/

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CalculatorApp.init();
    });
} else {
    // DOM is already ready
    CalculatorApp.init();
}

// Make CalculatorApp available globally for debugging
window.CalculatorApp = CalculatorApp;

console.log('App module loaded'); 