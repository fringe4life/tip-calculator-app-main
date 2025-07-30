// Tip Calculator App JavaScript

class TipCalculator {
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
    this.tipButtons = document.querySelectorAll('.tip-button:not(.tip-button--custom)');
    this.resetButton = document.getElementById('reset-button');
    this.tipAmountDisplay = document.getElementById('tip-amount');
    this.totalAmountDisplay = document.getElementById('total-amount');
    this.peopleError = document.getElementById('people-error');
    
    this.initializeEventListeners();
  }
  
  initializeEventListeners() {
    // Input event listeners
    this.billInput.addEventListener('input', (e) => {
      this.bill = parseFloat(e.target.value) || 0;
      this.calculate();
    });
    
    this.peopleInput.addEventListener('input', (e) => {
      this.people = parseInt(e.target.value) || 0;
      this.validatePeopleInput();
      this.calculate();
    });
    
    this.customTipInput.addEventListener('input', (e) => {
      this.tipPercentage = parseFloat(e.target.value) || 0;
      this.clearTipButtonSelection();
      this.calculate();
    });
    
    // Tip button event listeners
    this.tipButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.tipPercentage = parseFloat(e.target.dataset.tip);
        this.selectTipButton(e.target);
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
      input.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        const allowedChars = /[0-9.]/;
        
        if (!allowedKeys.includes(e.key) && !allowedChars.test(e.key)) {
          e.preventDefault();
        }
        
        // Prevent multiple decimal points
        if (e.key === '.' && input.value.includes('.')) {
          e.preventDefault();
        }
      });
    });
  }
  
  selectTipButton(selectedButton) {
    // Remove active class from all buttons
    this.tipButtons.forEach(button => {
      button.classList.remove('active');
    });
    
    // Add active class to selected button
    selectedButton.classList.add('active');
  }
  
  clearTipButtonSelection() {
    this.tipButtons.forEach(button => {
      button.classList.remove('active');
    });
  }
  
  clearCustomTipInput() {
    this.customTipInput.value = '';
  }
  
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
  
  updateDisplay() {
    this.tipAmountDisplay.textContent = `$${this.tipAmount.toFixed(2)}`;
    this.totalAmountDisplay.textContent = `$${this.totalAmount.toFixed(2)}`;
  }
  
  enableResetButton() {
    this.resetButton.disabled = false;
  }
  
  disableResetButton() {
    this.resetButton.disabled = true;
  }
  
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

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TipCalculator();
});

// Add error styling for invalid inputs
const style = document.createElement('style');
style.textContent = `
  .input-group__input.error {
    border-color: var(--color-error);
  }
  
  .input-group__input.error:focus {
    border-color: var(--color-error);
  }
`;
document.head.appendChild(style); 