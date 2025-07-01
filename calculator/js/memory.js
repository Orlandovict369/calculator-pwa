/*
===========================================
MEMORY/HISTORY MANAGEMENT MODULE
===========================================

This module handles:
1. Storing calculation history
2. Managing memory panel visibility
3. Memory operations (clear, recall)
4. Local storage persistence

EDUCATIONAL CONCEPTS:
- Array manipulation and management
- Local storage for data persistence
- Event handling for user interactions
- DOM manipulation for dynamic content
*/

// Memory state
const MemoryState = {
    history: [],
    maxHistoryItems: 10,
    isVisible: false
};

// Memory DOM elements
let memoryElements = null;

/**
 * Initialize memory module
 * WHAT: Sets up memory panel and loads saved history
 * WHY: Prepares memory functionality and restores previous session
 * HOW: Gets DOM elements, loads from localStorage, sets up events
 */
function initializeMemory() {
    memoryElements = {
        panel: document.getElementById('memory-panel'),
        list: document.getElementById('memory-list')
    };

    // Verify elements exist
    if (!memoryElements.panel || !memoryElements.list) {
        console.error('Memory elements not found!');
        return false;
    }

    // Load history from localStorage
    loadHistoryFromStorage();
    
    // Set up memory item click handlers
    setupMemoryItemHandlers();
    
    // Initial render
    renderMemoryList();

    console.log('Memory module initialized');
    return true;
}

/*
EDUCATIONAL NOTE: Why use localStorage?
- Persists data between browser sessions
- Simple key-value storage for small amounts of data
- Synchronous API that's easy to use
- Perfect for user preferences and history
- Data remains until user clears it or we programmatically remove it
*/

const MemoryManager = {

    /**
     * Add a calculation to history
     * WHAT: Stores a completed calculation in memory
     * WHY: Provides user with calculation history
     * HOW: Adds to array, manages size limit, updates storage and display
     */
    addCalculation(expression, result) {
        // Create history item object
        const historyItem = {
            id: Date.now(), // Simple unique ID using timestamp
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleTimeString()
        };

        // Add to beginning of array (most recent first)
        MemoryState.history.unshift(historyItem);

        // Limit history size - remove oldest items
        if (MemoryState.history.length > MemoryState.maxHistoryItems) {
            MemoryState.history = MemoryState.history.slice(0, MemoryState.maxHistoryItems);
        }

        // Save to localStorage and update display
        saveHistoryToStorage();
        renderMemoryList();

        console.log('Calculation added to history:', historyItem);
    },

    /**
     * Clear all history
     * WHAT: Removes all calculation history
     * WHY: Allows user to reset their history
     * HOW: Clears array, updates storage and display
     */
    clearHistory() {
        MemoryState.history = [];
        saveHistoryToStorage();
        renderMemoryList();
        
        console.log('History cleared');
    },

    /**
     * Toggle memory panel visibility
     * WHAT: Shows/hides the memory panel
     * WHY: User control over when to see history
     * HOW: CSS class manipulation with animation
     */
    togglePanel() {
        if (!memoryElements.panel) return;

        MemoryState.isVisible = !MemoryState.isVisible;

        if (MemoryState.isVisible) {
            memoryElements.panel.classList.add('active');
            // Update display when showing panel
            renderMemoryList();
        } else {
            memoryElements.panel.classList.remove('active');
        }

        console.log('Memory panel toggled:', MemoryState.isVisible);
    },

    /**
     * Recall a calculation from history
     * WHAT: Loads a previous calculation back into calculator
     * WHY: Allows user to build on previous calculations
     * HOW: Finds history item and loads its result into calculator
     */
    recallCalculation(historyId) {
        const historyItem = MemoryState.history.find(item => item.id === historyId);
        
        if (!historyItem) {
            console.warn('History item not found:', historyId);
            return;
        }

        // Clear calculator and set the recalled value
        Calculator.clear();
        Calculator.inputNumber(historyItem.result.toString());
        
        // Update display
        DisplayManager.update();

        console.log('Calculation recalled:', historyItem);
    },

    /**
     * Get current history
     * WHAT: Returns current history array
     * WHY: Allows other modules to access history
     */
    getHistory() {
        return [...MemoryState.history]; // Return copy to prevent external modification
    },

    /**
     * Check if memory panel is visible
     * WHAT: Returns visibility state
     * WHY: Allows other modules to check panel state
     */
    isVisible() {
        return MemoryState.isVisible;
    }
};

/**
 * Render the memory list in the DOM
 * WHAT: Updates the visual display of calculation history
 * WHY: Shows current history to the user
 * HOW: Generates HTML elements for each history item
 */
function renderMemoryList() {
    if (!memoryElements.list) return;

    // Clear current list
    memoryElements.list.innerHTML = '';

    // Show empty state if no history
    if (MemoryState.history.length === 0) {
        const emptyElement = document.createElement('p');
        emptyElement.className = 'memory-empty';
        emptyElement.textContent = 'No calculations yet';
        memoryElements.list.appendChild(emptyElement);
        return;
    }

    // Create elements for each history item
    MemoryState.history.forEach(item => {
        const memoryItem = createMemoryItemElement(item);
        memoryElements.list.appendChild(memoryItem);
    });

    console.log('Memory list rendered:', MemoryState.history.length, 'items');
}

/**
 * Create DOM element for a single memory item
 * WHAT: Creates the HTML structure for one history item
 * WHY: Reusable function for consistent item creation
 * HOW: Creates elements and sets up click handlers
 */
function createMemoryItemElement(historyItem) {
    // Main container
    const itemElement = document.createElement('div');
    itemElement.className = 'memory-item';
    itemElement.setAttribute('data-id', historyItem.id);
    itemElement.setAttribute('role', 'button');
    itemElement.setAttribute('tabindex', '0');
    itemElement.setAttribute('aria-label', `Recall calculation: ${historyItem.expression} equals ${historyItem.result}`);

    // Expression part
    const expressionElement = document.createElement('div');
    expressionElement.className = 'memory-expression';
    expressionElement.textContent = historyItem.expression;

    // Result part
    const resultElement = document.createElement('div');
    resultElement.className = 'memory-result';
    resultElement.textContent = historyItem.result;

    // Timestamp (optional, could be hidden in UI)
    const timestampElement = document.createElement('div');
    timestampElement.className = 'memory-timestamp';
    timestampElement.textContent = historyItem.timestamp;
    timestampElement.style.fontSize = 'var(--font-size-sm)';
    timestampElement.style.color = 'var(--text-secondary)';
    timestampElement.style.marginTop = 'var(--space-xs)';

    // Assemble the item
    itemElement.appendChild(expressionElement);
    itemElement.appendChild(resultElement);
    itemElement.appendChild(timestampElement);

    return itemElement;
}

/**
 * Set up event handlers for memory items
 * WHAT: Adds click handlers to memory list container
 * WHY: Allows users to interact with history items
 * HOW: Event delegation for dynamically created elements
 */
function setupMemoryItemHandlers() {
    if (!memoryElements.list) return;

    // Use event delegation - listen on parent, handle clicks on children
    memoryElements.list.addEventListener('click', (event) => {
        const memoryItem = event.target.closest('.memory-item');
        if (!memoryItem) return;

        const historyId = parseInt(memoryItem.getAttribute('data-id'));
        MemoryManager.recallCalculation(historyId);
    });

    // Keyboard accessibility
    memoryElements.list.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            const memoryItem = event.target.closest('.memory-item');
            if (!memoryItem) return;

            event.preventDefault();
            const historyId = parseInt(memoryItem.getAttribute('data-id'));
            MemoryManager.recallCalculation(historyId);
        }
    });

    console.log('Memory item handlers set up');
}

/**
 * Save history to localStorage
 * WHAT: Persists current history to browser storage
 * WHY: Maintains history across browser sessions
 * HOW: JSON.stringify and localStorage.setItem
 */
function saveHistoryToStorage() {
    try {
        const historyData = {
            history: MemoryState.history,
            timestamp: Date.now()
        };
        localStorage.setItem('calculator-history', JSON.stringify(historyData));
        console.log('History saved to localStorage');
    } catch (error) {
        console.warn('Failed to save history to localStorage:', error);
    }
}

/**
 * Load history from localStorage
 * WHAT: Retrieves saved history from browser storage
 * WHY: Restores user's previous session
 * HOW: localStorage.getItem and JSON.parse with error handling
 */
function loadHistoryFromStorage() {
    try {
        const savedData = localStorage.getItem('calculator-history');
        if (!savedData) return;

        const historyData = JSON.parse(savedData);
        
        // Validate data structure
        if (historyData && Array.isArray(historyData.history)) {
            MemoryState.history = historyData.history;
            console.log('History loaded from localStorage:', MemoryState.history.length, 'items');
        }
    } catch (error) {
        console.warn('Failed to load history from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('calculator-history');
    }
}

/*
EDUCATIONAL NOTE: Event Delegation Pattern
Why use event delegation instead of adding listeners to each item?
1. Performance - only one listener instead of many
2. Dynamic content - works with items added later
3. Memory efficient - prevents memory leaks
4. Simpler to manage - one place to handle all item clicks

This pattern is essential for dynamic content in web applications.
*/

/*
EDUCATIONAL NOTE: Memory Module Benefits
This approach provides:
1. Data persistence across sessions
2. Efficient memory management (size limits)
3. Clean separation from calculator logic
4. Accessible user interface
5. Performance optimizations (event delegation)

FUTURE EXTENSIONS:
- Export history to file
- Search/filter history
- Different memory slots (like scientific calculators)
- History categories or tags
- Sync across devices (with backend)
- Import/export history data

COMMON BEGINNER MISTAKES I'M AVOIDING:
1. Not limiting history size (memory leaks)
2. No data validation when loading from storage
3. Adding event listeners to each dynamic element
4. No error handling for localStorage operations
5. Not providing keyboard accessibility
6. Storing too much data in localStorage
*/

console.log('Memory module loaded'); 