// app.js - Código Profissional (Versão Final)
class ScientificCalculator {
    constructor() {
      // Estado da calculadora
      this.currentInput = '0';
      this.previousOperand = null;
      this.operation = undefined;
      this.memory = 0;
      this.angleMode = 'DEG'; // DEG/RAD/GRAD
      this.newNumber = true;
  
      // Configuração inicial
      this.initializeCalculator();
      this.setupEventListeners();
    }
  
    initializeCalculator() {
      this.createCalculatorStructure();
      //this.generateButtons();
    }
  
    createCalculatorStructure() {
      const calculator = document.querySelector('.calculator');
      
      // Limpa conteúdo existente
      calculator.innerHTML = '';
  
      // Cria componentes principais
      calculator.appendChild(this.createStatusBar());
      calculator.appendChild(this.createDisplay());
      calculator.appendChild(this.createButtonGrid());
    }
  
    createStatusBar() {
      const statusBar = document.createElement('div');
      statusBar.className = 'status-bar';
      statusBar.innerHTML = `
        <span class="angle-mode">${this.angleMode}</span>
        <div class="memory-indicators">
          <span class="memory-status">${this.memory ? 'M' : ''}</span>
          <span class="fe-mode">F-E</span>
        </div>
      `;
      return statusBar;
    }
  
    createDisplay() {
      const display = document.createElement('div');
      display.className = 'display';
      display.textContent = '0';
      return display;
    }
  
    createButtonGrid() {
      this.buttonLayout = [
        ['MC', 'MR', 'M+', 'M-', 'MS', 'M˅'],
        ['2ⁿ', 'x²', '√', '%', 'mod', '|x|'],
        ['π', 'e', '(', ')', 'n!', '10ˣ'],
        ['xʸ', '7', '8', '9', '÷', 'sin'],
        ['log', '4', '5', '6', '×', 'cos'],
        ['ln', '1', '2', '3', '-', 'tan'],
        ['±', '0', '.', '=', '+', 'Rand']
      ];
  
      const container = document.createElement('div');
      container.className = 'buttons-container';
  
      this.buttonLayout.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        
          // Ajuste especial para última linha
        if (rowIndex === this.buttonLayout.length - 1) {
        rowDiv.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 1fr';
      }

        row.forEach(btnText => {
          const button = this.createButton(btnText);
          rowDiv.appendChild(button);
        });
        
        container.appendChild(rowDiv);
      });
  
      return container;
    }
  
    createButton(text) {
      const button = document.createElement('button');
      button.className = `btn ${this.getButtonType(text)}`;
      button.textContent = text;
      button.dataset.action = text;
      return button;
    }
  
    getButtonType(text) {
      if (/\d/.test(text)) return 'number';
      if (['+', '-', '×', '÷', 'xʸ'].includes(text)) return 'operator';
      if (text === '=') return 'equals';
      if (text.startsWith('M')) return 'memory';
      return 'scientific';
    }
  
    setupEventListeners() {
      // Evento de clique
      document.querySelector('.buttons-container').addEventListener('click', (e) => {
        if (e.target.matches('button')) {
          this.handleButtonClick(e.target.dataset.action);
        }
      });
  
      // Evento de teclado
      document.addEventListener('keydown', (e) => {
        const keyMap = {
            'Enter': '=',
            'Backspace': '⌫',
            'Delete': 'C',
            'Escape': 'C',
            '/': '÷',
            '*': '×',
            '^': 'xʸ',
            '!': 'n!',
            's': 'sin',
            'c': 'cos',
            't': 'tan',
            'l': 'log',
            'n': 'ln',
            'q': '√',
            'r': 'Rand'
        };
        
        this.handleButtonClick(keyMap[e.key] || e.key);
      });
    }
  
    handleButtonClick(action) {
      if (!action) return;
  
      if (/\d|\./.test(action)) {
        this.handleNumberInput(action);
      } else if (['+', '-', '×', '÷', 'xʸ'].includes(action)) {
        this.handleOperator(action);
      } else if (action === '=') {
        this.calculate();
      } else if (action.startsWith('M')) {
        this.handleMemoryAction(action);
      } else if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'n!', 'π', 'e'].includes(action)) {
        this.handleScientificFunction(action);
      } else if (action === '±') {
        this.toggleSign();
      } else if (action === '%') {
        this.handlePercentage();
      }
  
      this.updateUI();
    }
  
    handleNumberInput(num) {
      if (this.newNumber) {
        this.currentInput = num === '.' ? '0.' : num;
        this.newNumber = false;
      } else {
        if (num === '.' && this.currentInput.includes('.')) return;
        this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
      }
    }
  
    handleOperator(operator) {
      this.previousOperand = this.currentInput;
      this.operation = operator;
      this.newNumber = true;
    }
  
    handleMemoryAction(action) {
      switch(action) {
        case 'MC': this.memory = 0; break;
        case 'MR': this.currentInput = this.memory.toString(); break;
        case 'M+': this.memory += parseFloat(this.currentInput); break;
        case 'M-': this.memory -= parseFloat(this.currentInput); break;
        case 'MS': this.memory = parseFloat(this.currentInput); break;
      }
    }
  
    handleScientificFunction(func) {
      try {
        const num = parseFloat(this.currentInput);
        
        switch(func) {
          case 'sin': 
            const radians = this.angleMode === 'DEG' ? num * (Math.PI/180) : num;
            this.currentInput = Math.sin(radians).toString();
            break;
          case 'cos':
            const radiansCos = this.angleMode === 'DEG' ? num * (Math.PI/180) : num;
            this.currentInput = Math.cos(radiansCos).toString();
            break;
          case 'tan':
            const radiansTan = this.angleMode === 'DEG' ? num * (Math.PI/180) : num;
            this.currentInput = Math.tan(radiansTan).toString();
            break;
          case 'log':
            if (num <= 0) throw new Error('Número inválido para logaritmo');
            this.currentInput = Math.log10(num).toString();
            break;
          case 'ln':
            if (num <= 0) throw new Error('Número inválido para log natural');
            this.currentInput = Math.log(num).toString();
            break;
          case '√':
            if (num < 0) throw new Error('Raiz quadrada de número negativo');
            this.currentInput = Math.sqrt(num).toString();
            break;
          case 'n!':
            this.currentInput = this.factorial(num).toString();
            break;
          case 'π':
            this.currentInput = Math.PI.toString();
            break;
          case 'e':
            this.currentInput = Math.E.toString();
            case '2ⁿ':
            this.currentInput = Math.pow(2, num).toString();
            break;
            case 'x²':
            this.currentInput = Math.pow(num, 2).toString();
            break;
            case 'mod':
            if (this.previousOperand === null) return;
            this.currentInput = (parseFloat(this.previousOperand) % num).toString();
            break;
            case '|x|':
            this.currentInput = Math.abs(num).toString();
            break;
            case '10ˣ':
            this.currentInput = Math.pow(10, num).toString();
            break;
            case 'Rand':
            this.currentInput = Math.random().toString();
            break;
        }
        
        this.newNumber = true;
      } catch (error) {
        this.handleError(error.message);
      }
    }
  
    factorial(n) {
      if (n < 0) throw new Error('Fatorial negativo');
      if (n === 0 || n === 1) return 1;
      return n * this.factorial(n - 1);
    }
  
    calculate() {
      if (!this.operation || this.newNumber) return;
  
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentInput);
      let result;
  
      try {
        switch(this.operation) {
          case '+': result = prev + current; break;
          case '-': result = prev - current; break;
          case '×': result = prev * current; break;
          case '÷': 
            if (current === 0) throw new Error('Divisão por zero');
            result = prev / current;
            break;
          case 'xʸ': result = Math.pow(prev, current); break;
          case '√': result = Math.sqrt(current); break;
            case '%': result = (prev * current)/100; break;
        }
  
        this.currentInput = this.sanitizeNumber(result);
        this.operation = undefined;
        this.previousOperand = null;
        this.newNumber = true;
      } catch (error) {
        this.handleError(error.message);
      }
    }
  
    sanitizeNumber(num) {
        // Formata números grandes usando notação científica
        if (Math.abs(num) >= 1e12 || Math.abs(num) < 1e-6) {
         return num.toExponential(6).replace(/e\+?/, '×10^');
         }
  
            // Remove zeros decimais desnecessários
            return num.toLocaleString('en-US', {
                maximumFractionDigits: 10,
                useGrouping: false
            }).replace(/\.?0+$/, '');
}
  
    toggleSign() {
      this.currentInput = (parseFloat(this.currentInput) * -1).toString();
    }
  
    handlePercentage() {
      this.currentInput = (parseFloat(this.currentInput) / 100).toString();
    }
  
    handleError(message) {
      const display = document.querySelector('.display');
      display.textContent = 'Erro';
      display.classList.add('error');
      
      setTimeout(() => {
        this.clear();
        display.classList.remove('error');
      }, 2000);
    }
  
    clear() {
      this.currentInput = '0';
      this.previousOperand = null;
      this.operation = undefined;
      this.newNumber = true;
      this.updateUI();
    }
  
    updateUI() {
      this.updateDisplay();
      this.updateMemoryIndicator();
    }
  
    updateDisplay() {
      const display = document.querySelector('.display');
      let value = this.currentInput.replace('.', ',');
      
      if (value.length > 12) {
        value = parseFloat(this.currentInput).toExponential(6);
      }
      
      display.textContent = value;
    }
  
    updateMemoryIndicator() {
      const memIndicator = document.querySelector('.memory-status');
      memIndicator.textContent = this.memory !== 0 ? 'M' : '';
    }
  }
  
  // Inicialização
  document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
  });