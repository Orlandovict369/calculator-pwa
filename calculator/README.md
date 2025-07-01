# 🧮 Vanilla JavaScript Calculator

A fully functional calculator built with vanilla JavaScript, HTML, and CSS. This project is designed for learning fundamental web development concepts with a focus on clean code organization, accessibility, and scalability.

## 🎯 Project Goals

This calculator serves as an educational foundation for understanding:
- **Clean Code Organization** - Modular structure with separation of concerns
- **Vanilla JavaScript Fundamentals** - No frameworks, pure JavaScript concepts
- **Accessibility** - Semantic HTML and ARIA attributes
- **Scalable Architecture** - Easy to extend with new features

## ✨ Features

### Core Functionality
- ✅ Basic mathematical operations (+, -, ×, ÷)
- ✅ Clear/reset functionality (AC/CE)
- ✅ Memory feature showing calculation history (last 10 calculations)
- ✅ Error handling for division by zero and invalid inputs
- ✅ Decimal point support with validation
- ✅ Keyboard shortcuts for all operations

### User Experience
- ✅ Responsive design for mobile and desktop
- ✅ Smooth animations and visual feedback
- ✅ Accessible interface with ARIA labels
- ✅ Persistent calculation history (localStorage)
- ✅ Intuitive button layout

## 🏗️ Project Structure

```
calculator/
├── index.html              # Main HTML structure
├── css/
│   ├── styles.css          # Global styles, variables, layout
│   └── components.css      # Component-specific styles
├── js/
│   ├── calculator.js       # Core calculation logic
│   ├── display.js          # Display management
│   ├── memory.js           # History/memory management
│   └── app.js              # Main application controller
└── README.md               # This file
```

### Why This Structure?

**Separation of Concerns**: Each file has a single, clear responsibility:
- `calculator.js` - Pure mathematical logic, no DOM manipulation
- `display.js` - Only handles visual updates and animations
- `memory.js` - Manages data persistence and history
- `app.js` - Coordinates everything and handles user input

**Scalability**: Adding new features is straightforward:
- New operators? Add to `calculator.js`
- New themes? Modify CSS custom properties
- New UI elements? Extend appropriate modules

## 🧠 Educational Concepts Demonstrated

### 1. **State Management**
```javascript
// Central state object - easy to debug and manage
const CalculatorState = {
    currentInput: '0',
    expression: '',
    operator: null,
    previousValue: null,
    waitingForNewInput: false,
    hasError: false
};
```

### 2. **Module Pattern**
```javascript
// Self-contained module with clear API
const Calculator = {
    clear() { /* ... */ },
    inputNumber(number) { /* ... */ },
    calculate() { /* ... */ }
};
```

### 3. **Event Delegation**
```javascript
// One event listener handles all button clicks
buttonGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.btn');
    if (!button) return;
    this.handleButtonClick(button);
});
```

### 4. **Error Handling**
```javascript
try {
    const result = operation(prev, current);
    return result;
} catch (error) {
    this.setError(error.message);
    return null;
}
```

### 5. **Data Persistence**
```javascript
// Save to localStorage with error handling
function saveHistoryToStorage() {
    try {
        localStorage.setItem('calculator-history', JSON.stringify(historyData));
    } catch (error) {
        console.warn('Failed to save history:', error);
    }
}
```

### 6. **Accessibility**
```html
<!-- Semantic HTML with proper ARIA labels -->
<button class="btn btn-operator" data-operator="+" aria-label="Add">+</button>
<div class="display" role="textbox" aria-live="polite" aria-label="Calculator display">
```

## 🚀 How to Run

1. **Clone or download** the project files
2. **Open `index.html`** in any modern web browser
3. **Start calculating!** Use mouse clicks or keyboard shortcuts

### Keyboard Shortcuts
- **Numbers**: `0-9`, `.` (decimal point)
- **Operators**: `+`, `-`, `*` (multiply), `/` (divide)
- **Actions**: 
  - `Enter` or `=` - Calculate result
  - `Escape` - Clear all (AC)
  - `Backspace` - Clear entry (CE)
  - `M` - Toggle memory panel

## 🔧 How to Extend

### Adding New Operations

1. **Add to operations object** (`calculator.js`):
```javascript
const CalculatorOperations = {
    '+': (a, b) => a + b,
    '%': (a, b) => a % b,  // Add modulo
    '^': (a, b) => Math.pow(a, b)  // Add power
};
```

2. **Add buttons** (`index.html`):
```html
<button class="btn btn-operator" data-operator="%" aria-label="Modulo">%</button>
```

3. **Add keyboard support** (`app.js`):
```javascript
case '%':
    this.handleOperatorInput('%');
    break;
```

### Adding Themes

1. **Create new CSS custom properties**:
```css
/* Dark theme */
:root[data-theme="dark"] {
    --primary-bg: #000000;
    --secondary-bg: #1a1a1a;
    /* ... other colors */
}
```

2. **Add theme toggle functionality**:
```javascript
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    root.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}
```

### Adding Scientific Functions

1. **Extend operations object**:
```javascript
const ScientificOperations = {
    'sin': (a) => Math.sin(a),
    'cos': (a) => Math.cos(a),
    'log': (a) => Math.log10(a)
};
```

2. **Create scientific mode UI**:
```html
<div class="scientific-panel">
    <button class="btn btn-scientific" data-function="sin">sin</button>
    <button class="btn btn-scientific" data-function="cos">cos</button>
</div>
```

## 🆚 React Comparison

Here's how the same calculator state management would look in React:

### Vanilla JavaScript (Current)
```javascript
// State management with plain objects
const CalculatorState = {
    currentInput: '0',
    expression: '',
    operator: null
};

// Manual DOM updates
function updateDisplay() {
    document.getElementById('result').textContent = CalculatorState.currentInput;
}
```

### React Version
```jsx
// State management with hooks
function Calculator() {
    const [currentInput, setCurrentInput] = useState('0');
    const [expression, setExpression] = useState('');
    const [operator, setOperator] = useState(null);

    // Automatic re-rendering when state changes
    return (
        <div className="display">
            <div className="expression">{expression}</div>
            <div className="result">{currentInput}</div>
        </div>
    );
}
```

### Key Differences:
- **State**: React uses hooks, vanilla JS uses objects
- **Updates**: React re-renders automatically, vanilla JS requires manual DOM updates
- **Events**: React uses JSX event handlers, vanilla JS uses addEventListener
- **Data Flow**: React is declarative (describe what), vanilla JS is imperative (describe how)

## 🚫 Common Beginner Mistakes Avoided

### ❌ Poor State Management
```javascript
// BAD: Global variables everywhere
let result = 0;
let operator = '';
let display = '';
```

### ✅ Organized State
```javascript
// GOOD: Centralized state object
const CalculatorState = {
    currentInput: '0',
    expression: '',
    operator: null
};
```

### ❌ Mixed Concerns
```javascript
// BAD: Calculation logic mixed with DOM manipulation
function calculate() {
    const result = a + b;
    document.getElementById('display').textContent = result; // DOM mixed with logic
}
```

### ✅ Separation of Concerns
```javascript
// GOOD: Pure calculation logic
function calculate() {
    return a + b; // Pure function
}

// Separate display update
function updateDisplay(result) {
    document.getElementById('display').textContent = result;
}
```

### ❌ No Error Handling
```javascript
// BAD: No error handling
function divide(a, b) {
    return a / b; // What if b is 0?
}
```

### ✅ Proper Error Handling
```javascript
// GOOD: Comprehensive error handling
function divide(a, b) {
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b;
}
```

## 🎓 Learning Outcomes

After studying this calculator, you should understand:

1. **Code Organization** - How to structure JavaScript applications
2. **State Management** - Managing application state without frameworks
3. **Event Handling** - Efficient event delegation patterns
4. **DOM Manipulation** - Updating the UI with vanilla JavaScript
5. **Error Handling** - Graceful error handling and user feedback
6. **Accessibility** - Building inclusive user interfaces
7. **Data Persistence** - Using localStorage for data persistence
8. **Module Pattern** - Organizing code into reusable modules

## 🔮 Future Enhancements

Ready to level up? Try adding these features:

### Beginner Level
- [ ] Copy/paste support
- [ ] Dark/light theme toggle
- [ ] Sound effects for button presses
- [ ] Calculation history export

### Intermediate Level
- [ ] Scientific calculator mode
- [ ] Unit conversions
- [ ] Expression validation and suggestions
- [ ] Undo/redo functionality

### Advanced Level
- [ ] Mathematical expression parser
- [ ] Graphing capabilities
- [ ] Plugin system for custom operations
- [ ] Progressive Web App features

## 🤝 Contributing

Found a bug? Want to improve the educational content? 

1. Fork the repository
2. Create your feature branch
3. Add comprehensive comments explaining your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Additional Resources

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Grid Layout Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Event Delegation Pattern](https://javascript.info/event-delegation)

---

## 🎯 Success Criteria Checklist

- ✅ **Working calculator** that handles edge cases gracefully
- ✅ **Readable, well-commented code** you can understand and modify
- ✅ **Clear path for adding features** like scientific functions or themes
- ✅ **Foundation knowledge** to build more complex web applications
- ✅ **React comparison** to understand framework differences

Happy coding! 🚀 