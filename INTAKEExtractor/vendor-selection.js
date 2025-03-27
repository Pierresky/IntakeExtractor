document.addEventListener('DOMContentLoaded', () => {
    const vendorSelection = document.getElementById('vendor-selection');
    const workflow = document.getElementById('workflow');
    const vendorNameDisplay = document.getElementById('vendor-name');
    const gplansBtn = document.getElementById('gplans-btn');
    const redboxBtn = document.getElementById('redbox-btn');
    const trimrxBtn = document.getElementById('trimrx-btn');

    // Create a back to vendor selection button
    function createBackButton() {
        // Check if back button already exists
        if (document.getElementById('back-to-vendors')) return;

        const backButton = document.createElement('button');
        backButton.textContent = 'Change Vendor';
        backButton.id = 'back-to-vendors';
        backButton.classList.add('back-button');
        
        backButton.addEventListener('click', () => {
            // Hide workflow
            workflow.classList.add('hidden');
            
            // Show vendor selection
            vendorSelection.classList.remove('hidden');
            
            // Remove any loaded vendor scripts
            const vendorScripts = document.querySelectorAll('.vendor-script');
            vendorScripts.forEach(script => script.remove());
            
            // Reset result and textareas
            document.getElementById('result').innerHTML = '';
            document.getElementById('intakeData').value = '';
            document.getElementById('refillData').value = '';
            
            // Reset visit toggle to initial visit
            if (window.resetVisitToggle) {
                window.resetVisitToggle();
            }
        });

        // Add the back button to the vendor name display area
        vendorNameDisplay.appendChild(backButton);
    }

    // Dynamically load vendor-specific scripts
    function loadVendorScripts(vendorName) {
        // Remove any previously loaded vendor scripts
        const oldScripts = document.querySelectorAll('.vendor-script');
        oldScripts.forEach(script => script.remove());

        // Create and load initial visit script
        const initialScript = document.createElement('script');
        initialScript.src = `${vendorName}/${vendorName.toLowerCase()}-initial.js`;
        initialScript.classList.add('vendor-script');
        document.body.appendChild(initialScript);

        // Create and load refill visit script
        const refillScript = document.createElement('script');
        refillScript.src = `${vendorName}/${vendorName.toLowerCase()}-refill.js`;
        refillScript.classList.add('vendor-script');
        document.body.appendChild(refillScript);
    }

    gplansBtn.addEventListener('click', () => {
        vendorSelection.classList.add('hidden');
        workflow.classList.remove('hidden');
        vendorNameDisplay.textContent = 'GPLANS ';
        loadVendorScripts('GPLANS');
        createBackButton();
    });

    redboxBtn.addEventListener('click', () => {
        vendorSelection.classList.add('hidden');
        workflow.classList.remove('hidden');
        vendorNameDisplay.textContent = 'RedBox ';
        loadVendorScripts('REDBOX');
        createBackButton();
    });

    trimrxBtn.addEventListener('click', () => {
        vendorSelection.classList.add('hidden');
        workflow.classList.remove('hidden');
        vendorNameDisplay.textContent = 'TrimRx ';
        loadVendorScripts('TRIMRX');
        createBackButton();
    });
});