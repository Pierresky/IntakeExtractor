document.addEventListener('DOMContentLoaded', function() {
    const processInitialBtn = document.getElementById('process-initial-btn');
    const intakeDataTextarea = document.getElementById('intakeData');
    const resultDiv = document.getElementById('result');

    // This is a placeholder for the full InitialIntakeExtractor class
    // You would replace this with your full implementation
    class InitialIntakeExtractor {
        constructor(intakeText) {
            this.text = intakeText;
        }

        extract() {
            // Placeholder processing logic
            const result = `
                <h3>GPLANS Initial Visit Processing</h3>
                <p>Intake Data Received: ${this.text.substring(0, 100)}...</p>
            `;
            
            document.getElementById('result').innerHTML = result;
        }
    }

    processInitialBtn.addEventListener('click', function() {
        const intakeData = intakeDataTextarea.value;
        
        if (intakeData.trim() === '') {
            alert('Please enter intake data');
            return;
        }

        const initialExtractor = new InitialIntakeExtractor(intakeData);
        initialExtractor.extract();
    });
});