// Wait for JsBarcode to be available
window.onload = () => {
    const input = document.getElementById('barcodeInput');
    const saveButton = document.getElementById('saveButton');
    const historyContainer = document.getElementById('historyContainer');
    const barcodeContainer = document.querySelector('.barcode-container');
    const defaultText = 'Hello World!';

    // Barcode options
    const barcodeOptions = {
        format: "CODE128",
        width: 1,
        height: 80,
        displayValue: true,
        fontSize: 16,
        margin: 5
    };

    // Load history from localStorage
    const loadHistory = () => {
        const savedHistory = localStorage.getItem('barcodeHistory');
        return savedHistory ? JSON.parse(savedHistory) : [defaultText];
    };

    // Save history to localStorage
    const saveHistory = () => {
        const historyItems = Array.from(historyContainer.querySelectorAll('.history-button'))
            .map(button => button.textContent);
        localStorage.setItem('barcodeHistory', JSON.stringify(historyItems));
    };

    // Keep track of current barcode text
    let currentBarcodeText = defaultText;

    // Toggle fullscreen
    barcodeContainer.addEventListener('click', () => {
        barcodeContainer.classList.toggle('fullscreen');
        
        if (barcodeContainer.classList.contains('fullscreen')) {
            JsBarcode("#barcode", currentBarcodeText, {
                ...barcodeOptions,
                width: 2,
                height: 200,
                fontSize: 30,
                margin: 10
            });
        } else {
            JsBarcode("#barcode", currentBarcodeText, barcodeOptions);
        }
    });

    // Function to update barcode
    const updateBarcode = (text) => {
        if (text !== '') {
            try {
                currentBarcodeText = text; // Update the current barcode text
                if (barcodeContainer.classList.contains('fullscreen')) {
                    JsBarcode("#barcode", text, {
                        ...barcodeOptions,
                        width: 2,
                        height: 200,
                        fontSize: 30,
                        margin: 10
                    });
                } else {
                    JsBarcode("#barcode", text, barcodeOptions);
                }
            } catch (error) {
                console.error('Failed to generate barcode:', error);
            }
        }
    };

    // Add to history
    const addToHistory = (text) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        const button = document.createElement('button');
        button.className = 'history-button';
        button.textContent = text;
        button.onclick = () => updateBarcode(text);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '×';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            if (confirm('Delete this barcode from history?')) {
                historyItem.remove();
                saveHistory(); // Save after deletion
            }
        };

        historyItem.appendChild(button);
        historyItem.appendChild(deleteButton);
        historyContainer.insertBefore(historyItem, historyContainer.firstChild);
        saveHistory(); // Save after addition
    };

    // Save current text to history
    const saveCurrentText = () => {
        const text = input.value;
        if (text !== '') {
            addToHistory(text);
            updateBarcode(text);
            input.value = '';
        }
    };

    // Update barcode when text changes
    input.addEventListener('input', (e) => {
        const text = e.target.value;
        if (text !== '') {
            updateBarcode(text);
        }
    });

    // Handle Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveCurrentText();
        }
    });

    // Save button click handler
    saveButton.addEventListener('click', saveCurrentText);

    // Initialize history from localStorage
    const savedHistory = loadHistory();
    savedHistory.reverse().forEach(text => addToHistory(text));
    
    // Show the most recent barcode
    if (savedHistory.length > 0) {
        updateBarcode(savedHistory[savedHistory.length - 1]);
    }
}; 