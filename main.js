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

    // Toggle fullscreen
    barcodeContainer.addEventListener('click', () => {
        barcodeContainer.classList.toggle('fullscreen');
        
        // Regenerate barcode with appropriate dimensions
        const currentText = input.value || defaultText;
        if (barcodeContainer.classList.contains('fullscreen')) {
            JsBarcode("#barcode", currentText, {
                ...barcodeOptions,
                width: 2,
                height: 200,
                fontSize: 30,
                margin: 10
            });
        } else {
            JsBarcode("#barcode", currentText, barcodeOptions);
        }
    });

    // Function to update barcode
    const updateBarcode = (text) => {
        if (text !== '') {
            try {
                // Use appropriate dimensions based on fullscreen state
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
        button.onclick = () => updateBarcode(text); // Only update barcode, not input

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '×';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            if (confirm('Delete this barcode from history?')) {
                historyItem.remove();
            }
        };

        historyItem.appendChild(button);
        historyItem.appendChild(deleteButton);
        historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    };

    // Save current text to history
    const saveCurrentText = () => {
        const text = input.value;
        if (text !== '') {
            addToHistory(text);
            updateBarcode(text);
            input.value = ''; // Clear input after saving
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

    // Add initial text to history
    addToHistory(defaultText);
}; 