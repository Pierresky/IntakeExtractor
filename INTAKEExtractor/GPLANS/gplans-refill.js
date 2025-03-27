document.addEventListener('DOMContentLoaded', function() {
    const processRefillBtn = document.getElementById('process-refill-btn');
    const refillDataTextarea = document.getElementById('refillData');
    const resultDiv = document.getElementById('result');

    processRefillBtn.addEventListener('click', function() {
        const refillData = refillDataTextarea.value;
        
        if (refillData.trim() === '') {
            alert('Please enter refill data');
            return;
        }

        // Placeholder refill processing logic
        const result = `
            <h3>GPLANS Refill Visit Processing</h3>
            <p>Refill Data Received: ${refillData.substring(0, 100)}...</p>
        `;
        
        resultDiv.innerHTML = result;
    });
});