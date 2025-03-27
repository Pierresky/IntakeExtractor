document.addEventListener('DOMContentLoaded', function() {
    const processInitialBtn = document.getElementById('process-initial-btn');
    const intakeDataTextarea = document.getElementById('intakeData');
    const resultDiv = document.getElementById('result');

    processInitialBtn.addEventListener('click', function() {
        const intakeData = intakeDataTextarea.value;
        
        if (intakeData.trim() === '') {
            alert('Please enter intake data');
            return;
        }

        // Placeholder TrimRx initial visit processing logic
        const result = `
            <h3>TrimRx Initial Visit Processing</h3>
            <p>Intake Data Received: ${intakeData.substring(0, 100)}...</p>
        `;
        
        resultDiv.innerHTML = result;
    });
});