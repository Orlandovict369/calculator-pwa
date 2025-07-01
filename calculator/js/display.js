/*
===========================================
DISPLAY MANAGEMENT MODULE
===========================================

This module handles:
1. Updating the calculator display
2. Managing display states (normal, error)
3. Animation and visual feedback
4. Accessibility updates

EDUCATIONAL CONCEPTS:
- DOM manipulation with vanilla JavaScript
- Separation of concerns (display vs logic)
- Accessibility with ARIA attributes
- Visual state management
*/

// Display elements - cached for performance
let displayElements = null;

/**
 * Initialize display module
 * WHAT: Gets references to DOM elements and caches them
 * WHY: Avoids repeated DOM queries for better performance
 * HOW: Uses getElementById and stores references
 */
function initializeDisplay() {
    displayElements = {
        expression: document.getElementById('expression'),
        result: document.getElementById('result'),
        display: document.querySelector('.display')
    };

    // Verify all elements exist
    if (!displayElements.expression || !displayElements.result || !displayElements.display) {
        console.error('Display elements not found!');
        return false;
    }

    console.log('Display module initialized');
    return true;
}

/*
EDUCATIONAL NOTE: Why cache DOM elements?
- DOM queries are expensive operations
- Caching improves performance, especially with frequent updates
- Easier to maintain and debug
- Common pattern in JavaScript applications
*/

const DisplayManager = {

    /**
     * Update the main calculator display
     * WHAT: Updates both expression and result displays
     * WHY: Central function for all display updates
     * HOW: Gets data from Calculator and updates DOM elements
     */
    update() {
        if (!displayElements) {
            console.warn('Display not initialized');
            return;
        }

        const expression = Calculator.getDisplayExpression();
        const result = Calculator.getDisplayResult();
        const state = Calculator.getState();

        // Update expression display
        this.updateExpression(expression);
        
        // Update result display
        this.updateResult(result);

        // Update error state
        this.updateErrorState(state.hasError);

        // Update accessibility
        this.updateAccessibility(expression, result, state.hasError);

        console.log('Display updated:', { expression, result, hasError: state.hasError });
    },

    /**
     * Update the expression display (smaller text at top)
     * WHAT: Shows the current mathematical expression
     * WHY: Provides context for the current calculation
     */
    updateExpression(expression) {
        if (!displayElements.expression) return;

        // Show empty string or the expression
        displayElements.expression.textContent = expression || '';
        
        // Add subtle animation when expression changes
        this.addUpdateAnimation(displayElements.expression);
    },

    /**
     * Update the result display (main large number)
     * WHAT: Shows current input or calculation result
     * WHY: Primary display of calculator state
     */
    updateResult(result) {
        if (!displayElements.result) return;

        displayElements.result.textContent = result;
        
        // Add animation for result changes
        this.addUpdateAnimation(displayElements.result);

        // Handle very long numbers
        this.handleLongNumbers(displayElements.result);
    },

    /**
     * Handle display of very long numbers
     * WHAT: Adjusts font size for long results
     * WHY: Ensures numbers remain readable
     * HOW: Dynamically adjusts CSS based on content length
     */
    handleLongNumbers(element) {
        const text = element.textContent;
        const maxLength = 12; // Adjust based on your design

        if (text.length > maxLength) {
            element.style.fontSize = 'var(--font-size-xl)';
        } else {
            element.style.fontSize = 'var(--font-size-display)';
        }
    },

    /**
     * Update error state styling
     * WHAT: Applies error styling when calculator has error
     * WHY: Visual feedback for error states
     */
    updateErrorState(hasError) {
        if (!displayElements.display) return;

        if (hasError) {
            displayElements.display.classList.add('error');
        } else {
            displayElements.display.classList.remove('error');
        }
    },

    /**
     * Add subtle animation when display updates
     * WHAT: Adds visual feedback for changes
     * WHY: Improves user experience with smooth transitions
     * HOW: Temporarily adds CSS class with animation
     */
    addUpdateAnimation(element) {
        // Remove existing animation class
        element.classList.remove('updating');
        
        // Force reflow to ensure class removal takes effect
        element.offsetHeight;
        
        // Add animation class
        element.classList.add('updating');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('updating');
        }, 200);
    },

    /**
     * Update accessibility attributes
     * WHAT: Updates ARIA attributes for screen readers
     * WHY: Ensures calculator is accessible to all users
     * HOW: Updates aria-label with current state
     */
    updateAccessibility(expression, result, hasError) {
        if (!displayElements.display) return;

        let ariaLabel = '';
        
        if (hasError) {
            ariaLabel = `Error: ${result}`;
        } else if (expression && result) {
            ariaLabel = `Expression: ${expression}, Result: ${result}`;
        } else {
            ariaLabel = `Current value: ${result}`;
        }

        displayElements.display.setAttribute('aria-label', ariaLabel);
        
        // Announce changes to screen readers
        displayElements.display.setAttribute('aria-live', 'polite');
    },

    /**
     * Clear display
     * WHAT: Resets display to initial state
     * WHY: Visual reset when calculator is cleared
     */
    clear() {
        if (!displayElements) return;

        displayElements.expression.textContent = '';
        displayElements.result.textContent = '0';
        displayElements.display.classList.remove('error');
        
        this.updateAccessibility('', '0', false);
        
        console.log('Display cleared');
    },

    /**
     * Show loading state (for future async operations)
     * WHAT: Shows loading indicator
     * WHY: User feedback for longer operations
     * FUTURE: Useful for complex calculations or API calls
     */
    showLoading() {
        if (!displayElements.result) return;
        
        displayElements.result.textContent = 'Calculating...';
        displayElements.display.classList.add('loading');
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        if (!displayElements.display) return;
        
        displayElements.display.classList.remove('loading');
    }
};

/*
EDUCATIONAL NOTE: Display Module Benefits
This pattern provides:
1. Separation of Concerns - display logic separate from calculation
2. Single Responsibility - each function does one thing
3. Maintainability - easy to change display without affecting logic
4. Accessibility - centralized ARIA attribute management
5. Performance - cached DOM references
6. Extensibility - easy to add animations, themes, etc.

FUTURE EXTENSIONS:
- Themes (dark/light mode)
- Custom number formatting
- Scientific notation for very large/small numbers
- Display animations and transitions
- Multi-line expression display
- Syntax highlighting for complex expressions

COMMON BEGINNER MISTAKES I'M AVOIDING:
1. Querying DOM elements repeatedly
2. Mixing display updates throughout the codebase
3. Not handling accessibility
4. No error state management
5. Hardcoded styling instead of CSS classes
6. Not handling edge cases (very long numbers)
*/

// Add CSS for update animations
const style = document.createElement('style');
style.textContent = `
.display .updating {
    transition: transform 0.1s ease;
    transform: scale(1.02);
}

.display.loading .display-result {
    opacity: 0.7;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
}
`;
document.head.appendChild(style);

console.log('Display module loaded'); 