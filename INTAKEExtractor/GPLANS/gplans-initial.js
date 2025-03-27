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

        // Extract preferred medication
        let preferredMeds = 'X';
        const medMatch = intakeData.match(/Medication the patient wants\?\n([A-Z ]+ [a-z]+ [a-z]+) \(.*\)/);
        
        if (medMatch) {
            preferredMeds = medMatch[1]
                .replace(/ compound| generic| brand/g, '') // Remove unwanted descriptors
                .trim();
        }

        // Extract weight, BMI, and goal weight
        const weightMatch = intakeData.match(/Weight \(lbs\.\)\n(\d+)/);
        const bmiMatch = intakeData.match(/BMI\n(\d+\.\d+)/);
        const goalWeightMatch = intakeData.match(/Goal weight\.\n(\d+)/);

        const weight = weightMatch ? weightMatch[1] : 'X';
        const bmi = bmiMatch ? bmiMatch[1] : 'X';
        const goalWeight = goalWeightMatch ? goalWeightMatch[1] : 'X';

        // Apply highlight only if there’s a value
        const highlightedMeds = preferredMeds === 'X' ? 'X' : `<span style="background-color:#FFFF00">${preferredMeds}</span>`;
        const highlightedWeight = weight === 'X' ? 'X' : `<span style="background-color:#FFFF00">${weight}</span>`;
        const highlightedBMI = bmi === 'X' ? 'X' : `<span style="background-color:#FFFF00">${bmi}</span>`;
        const highlightedGoalWeight = goalWeight === 'X' ? 'X' : `<span style="background-color:#FFFF00">${goalWeight}</span>`;

         // Extract weight loss medication history
         const currentlyTakingMatch = intakeData.match(/Are you currently taking medication\(s\) for weight loss\?\n(Yes|No)/);
         const currentMedsMatch = intakeData.match(/Please list the name, dose, and frequency of. your current weight loss medication\(s\).\n(.+)/);
         const pastMedsMatch = intakeData.match(/Have you taken any prescription medications to lose weight before\?\n(.+)/);
 
         const currentlyTaking = currentlyTakingMatch ? currentlyTakingMatch[1] : 'No';
         const currentMeds = currentMedsMatch ? currentMedsMatch[1].trim() : '';
         const pastMeds = pastMedsMatch ? pastMedsMatch[1].trim() : '';
 
         let weightLossHistory = '';
 
         if (currentlyTaking === 'Yes' && pastMeds.toLowerCase() !== 'no') {
             weightLossHistory = `The patient has tried <span style="background-color:#FFFF00">${pastMeds}</span> before and is currently taking <span style="background-color:#FFFF00">${currentMeds}</span> for weight loss.`;
         } else if (currentlyTaking === 'Yes') {
             weightLossHistory = `The patient is currently taking <span style="background-color:#FFFF00">${currentMeds}</span> medications for weight loss.`;
         } else if (pastMeds.toLowerCase() !== 'no') {
             weightLossHistory = `The patient has tried <span style="background-color:#FFFF00">${pastMeds}</span> medications in the past for weight loss.`;
         } else {
             weightLossHistory = `The patient <span style="background-color:#FFFF00">denied</span> medication in the past for weight loss.`;
         }
 

        // Format the result
        const result = `
            <h1>GPlans/FuturHealth Initial Visit Processing</h1>
            <h3><strong><span style="background-color:#FFFF00">Initial Visit</span></strong></h3>
            <ul>
                <li>The patient would like to start on ${highlightedMeds} medication.</li>
                <li>${weightLossHistory}</li>
                <li>Starting weight: ${highlightedWeight}</li>
                <li>Starting BMI: ${highlightedBMI}</li>
                <li>Goal weight: ${highlightedGoalWeight}</li>
                <li>Last labs completed:</li>
                <li>Local pharmacy:</li>
            </ul>

            <h3><strong>Refill Visit</strong></h3>
            <ul>
            <li>The patient is currently on X mg of Y for the last Z weeks.</li>
            <li>Date of last injection:</li>
            <li>How many injections has the patient taken on the current dose:</li>
            </ul>
        `;

        resultDiv.innerHTML = result;
    });
});
