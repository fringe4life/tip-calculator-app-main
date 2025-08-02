// Tip Calculator App JavaScript

/**
 * Tip Calculator class for handling tip calculations and UI interactions
 */
class TipCalculator {
  /**
   * Initialize the tip calculator with default values and DOM elements
   */
  constructor() {
    this.bill = 0;
    this.tipPercentage = 0;
    this.people = 0;
    this.tipAmount = 0;
    this.totalAmount = 0;
    
    // DOM elements
    this.billInput = document.getElementById('bill');
    this.peopleInput = document.getElementById('people');
    this.customTipInput = document.getElementById('custom-tip');
    this.tipButtons = document.querySelectorAll('.tip-button:not(.custom)');
    this.resetButton = document.getElementById('reset-button');
    this.tipAmountDisplay = document.getElementById('tip-amount');
    this.totalAmountDisplay = document.getElementById('total-amount');
    this.peopleError = document.getElementById('people-error');
    
    this.initializeEventListeners();
  }
  
  /**
   * Set up all event listeners for user interactions
   */
  initializeEventListeners() {
    // Input event listeners
    this.billInput.addEventListener('input', ({ target }) => {
      this.bill = parseFloat(target.value) ?? 0;
      this.calculate();
    });
    
    this.peopleInput.addEventListener('input', ({ target }) => {
      this.people = parseInt(target.value) ?? 0;
      this.validatePeopleInput();
      this.calculate();
    });
    
    this.customTipInput.addEventListener('input', ({ target }) => {
      this.tipPercentage = parseFloat(target.value) ?? 0;
      this.clearTipButtonSelection();
      this.calculate();
    });
    
    // Tip button event listeners
    this.tipButtons.forEach(button => {
      button.addEventListener('click', ({ target }) => {
        this.tipPercentage = parseFloat(target.dataset.tip);
        this.selectTipButton(target);
        this.clearCustomTipInput();
        this.calculate();
      });
    });
    
    // Reset button
    this.resetButton.addEventListener('click', () => {
      this.reset();
    });
    
    // Prevent non-numeric input (except decimal point and backspace)
    [this.billInput, this.peopleInput, this.customTipInput].forEach(input => {
      input.addEventListener('keydown', (event) => {
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        const allowedChars = /[0-9.]/;
        
        if (!allowedKeys.includes(event.key) && !allowedChars.test(event.key)) {
          event.preventDefault();
        }
        
        // Prevent multiple decimal points
        if (event.key === '.' && input.value.includes('.')) {
          event.preventDefault();
        }
      });
    });
  }
  
  /**
   * Select a tip button and update the UI
   * @param {HTMLElement} selectedButton - The button to mark as active
   */
  selectTipButton(selectedButton) {
    // Remove active class from all buttons
    this.tipButtons.forEach(button => {
      button.classList.remove('active');
    });
    
    // Add active class to selected button
    selectedButton.classList.add('active');
  }
  
  /**
   * Clear the active state from all tip buttons
   */
  clearTipButtonSelection() {
    this.tipButtons.forEach(button => {
      button.classList.remove('active');
    });
  }
  
  /**
   * Clear the custom tip input value
   */
  clearCustomTipInput() {
    this.customTipInput.value = '';
  }
  
  /**
   * Validate the people input and show/hide error messages
   */
  validatePeopleInput() {
    // Show error if people is 0 and we have bill and tip values
    if (this.people === 0 && this.bill > 0 && this.tipPercentage > 0) {
      this.peopleInput.setCustomValidity('Can\'t be zero');
      this.peopleInput.classList.add('error');
      this.peopleError.classList.add('show');
    } else if (this.people === 0) {
      // Clear error if no bill or tip values yet
      this.peopleInput.setCustomValidity('');
      this.peopleInput.classList.remove('error');
      this.peopleError.classList.remove('show');
    } else {
      // Clear error if people is valid
      this.peopleInput.setCustomValidity('');
      this.peopleInput.classList.remove('error');
      this.peopleError.classList.remove('show');
    }
  }
  
  /**
   * Calculate tip and total amounts based on current values
   */
  calculate() {
    // Always validate people input when calculating
    this.validatePeopleInput();
    
    if (this.bill > 0 && this.tipPercentage > 0 && this.people > 0) {
      const tipAmount = (this.bill * this.tipPercentage / 100) / this.people;
      const totalAmount = (this.bill / this.people) + tipAmount;
      
      this.tipAmount = Math.round(tipAmount * 100) / 100;
      this.totalAmount = Math.round(totalAmount * 100) / 100;
      
      this.updateDisplay();
      this.enableResetButton();
    } else {
      this.tipAmount = 0;
      this.totalAmount = 0;
      this.updateDisplay();
      this.disableResetButton();
    }
  }
  
  /**
   * Update the display with calculated amounts
   */
  updateDisplay() {
    this.tipAmountDisplay.textContent = `$${this.tipAmount.toFixed(2)}`;
    this.totalAmountDisplay.textContent = `$${this.totalAmount.toFixed(2)}`;
  }
  
  /**
   * Enable the reset button
   */
  enableResetButton() {
    this.resetButton.disabled = false;
  }
  
  /**
   * Disable the reset button
   */
  disableResetButton() {
    this.resetButton.disabled = true;
  }
  
  /**
   * Reset all calculator values and UI state
   */
  reset() {
    // Reset values
    this.bill = 0;
    this.tipPercentage = 0;
    this.people = 0;
    this.tipAmount = 0;
    this.totalAmount = 0;
    
    // Reset inputs
    this.billInput.value = '';
    this.peopleInput.value = '';
    this.customTipInput.value = '';
    
    // Reset UI
    this.clearTipButtonSelection();
    this.clearCustomTipInput();
    this.updateDisplay();
    this.disableResetButton();
    
    // Remove error states
    this.peopleInput.classList.remove('error');
    this.peopleInput.setCustomValidity('');
    this.peopleError.classList.remove('show');
    
    // Focus on bill input
    this.billInput.focus();
  }
}

/**
 * Initialize the calculator when DOM is loaded
 */
const initializeCalculator = () => {
  new TipCalculator();
};

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCalculator);

// Add error styling for invalid inputs
const style = document.createElement('style');
style.textContent = `
  .input.error {
    border-color: var(--color-error);
  }
  
  .input.error:focus {
    border-color: var(--color-error);
  }
`;
document.head.appendChild(style); 