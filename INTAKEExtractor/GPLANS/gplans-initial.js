document.addEventListener('DOMContentLoaded', function() {
    const processInitialBtn = document.getElementById('process-initial-btn');
    const intakeDataTextarea = document.getElementById('intakeData');
    const resultDiv = document.getElementById('result');

    processInitialBtn.addEventListener('click', function() {
        const intakeData = intakeDataTextarea.value;



        window.copyToClipboard = function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                const htmlContent = element.innerHTML; // Get the formatted HTML content
        
                // Create a temporary element to store the HTML
                const tempElement = document.createElement('div');
                tempElement.innerHTML = htmlContent;
        
                // Use clipboard API to copy as HTML
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const clipboardItem = new ClipboardItem({ 'text/html': blob });
        
                navigator.clipboard.write([clipboardItem]).then(() => {
                    alert('Copied Successfully!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        };

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

        // Extract blood pressure
        let bloodPressure = 'X';
        const bpMatch = intakeData.match(/What is your current or average blood pressure range\?\n(.+)/);
        if (bpMatch) {
            bloodPressure = bpMatch[1].trim();
        }

        // Extract resting heart rate
        let heartRate = 'X';
        const hrMatch = intakeData.match(/What is your current or average resting heart rate range\?\n(.+)/);
        if (hrMatch) {
            heartRate = hrMatch[1].trim();
        }


        // Extract surgical history properly
        let surgicalHistory = "Denies any surgical history including bariatric surgery.";
        const surgeryMatch = /Have you had bariatric \(weight loss\) surgery before\?\n([^\n]+)/.exec(intakeData);

        if (surgeryMatch) {
            let surgeryResponse = surgeryMatch[1].trim();
            if (surgeryResponse.toLowerCase() === "yes") {
                surgicalHistory = `<span style="background-color:#FFFF00">History of: Bariatric surgery</span>.`;
            } else if (surgeryResponse.toLowerCase() !== "no") {
                surgicalHistory = `<span style="background-color:#FFFF00">History of: ${surgeryResponse}</span>.`;
            }
        }

        const conditions = /Do any of the following currently or recently apply to you\?\n([\s\S]*?)(?:\nHave you been diagnosed|$)/.exec(intakeData);

        const bariatricSurgery = /Have you had bariatric \(weight loss\) surgery before\?\n(.*?)(?:\n|$)/.exec(intakeData);

        const diabetes = /Have you been diagnosed with prediabetes or type 2 diabetes\?\n(.*?)(?:\n|$)/.exec(intakeData);

        const medicationDetails = /If yes, please include name, dose, and frequency of all your medications[\s\S]*?\n([\s\S]*?)(?:\n\n|\n[A-Z]|$)/.exec(intakeData);

        // Extract additional medical conditions
        let otherConditions = [];
        const additionalConditions = /Please list any other medical conditions not mentioned above\.\n([\s\S]*?)(?=\n(?:Are|Is|Have|What|Please|If|How|Would|Did|When|Where|Why|The|Any)|\n\n|$)/s.exec(intakeData);

        if (additionalConditions && additionalConditions[1] && additionalConditions[1].trim() !== "" &&
            !additionalConditions[1].trim().toLowerCase().includes("none") &&
            !additionalConditions[1].trim().toLowerCase().includes("n/a")) {
            otherConditions = additionalConditions[1].trim().split(/[,;.\n]/).map(c => c.trim()).filter(c => c !== "");
        }

        // Define mapping for condition normalization
        const conditionMap = {
            "Hypertension (high blood pressure)": "High Blood Pressure",
            "Hypertension": "High Blood Pressure",
            "High blood pressure": "High Blood Pressure",
            "Liver disease, including nonalcoholic fatty liver disease (NAFLD)": "Liver Disease",
            "High cholesterol or triglycerides": "High Cholesterol",
            "High cholesterol": "High Cholesterol",
            "Asthma/reactive airway disease": "Asthma"
        };

        // Handling conditions
        const allConditions = [
            "Medullary thyroid cancer", "Multiple endocrine neoplasia type 2", "Abnormal heart rhythm", "Anorexia",
            "Asthma", "Anxiety", "Bulimia", "Cancer", "Crohn's Disease", "Depression", "Glaucoma", "Heart Attack",
            "High Blood Pressure", "High Cholesterol", "Hyperthyroidism", "Irritable Bowel Syndrome", "Kidney Disease",
            "Liver Disease", "Pancreatitis", "Seizures", "Stroke", "Ulcerative colitis", "bowel obstruction or impaction"
        ];

        let deniedConditions = [...allConditions];
        let historyOf = [];

        if (conditions) {
            const reportedConditions = conditions[1].split('\n').map(c => c.trim()).filter(c => c !== 'None of the above');

            reportedConditions.forEach(condition => {
                // Normalize the condition using the mapping
                const normalizedCondition = conditionMap[condition] || condition;

                // Remove from denied list and add to history
                const indexInDenied = deniedConditions.findIndex(c =>
                    c.toLowerCase() === normalizedCondition.toLowerCase());

                if (indexInDenied !== -1) {
                    deniedConditions.splice(indexInDenied, 1);
                    historyOf.push(normalizedCondition);
                } else if (condition && condition.trim() !== "" &&
                        condition.toLowerCase() !== "none of the above") {
                    // Add any condition not in our predefined list
                    historyOf.push(normalizedCondition);
                }
            });
        }

        // Add other conditions to history
        if (otherConditions.length > 0) {
            historyOf = [...historyOf, ...otherConditions];
        }

        // Handling diabetes
        if (diabetes && diabetes[1].toLowerCase() === 'yes') {
            historyOf.push("prediabetes or type 2 diabetes");
        }

        // Extract shipping address
        let shippingAddress = 'X';
        let hasPOBox = false;
        const addressMatch = intakeData.match(/Please list shipping address \(No PO boxes\)\n(.+)/);
        
        if (addressMatch) {
            shippingAddress = addressMatch[1].trim();
            
            // Check for PO Box in different formats (case insensitive)
            const poBoxRegex = /p\.?\s*o\.?\s*box|po\s*box|p\s*o\s*box/i;
            hasPOBox = poBoxRegex.test(shippingAddress);
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

            <h1>GPlans/FuturHealth Initial Visit Ai version</h1>
            <div id="initialVisitAiSection">
             <h3><strong><span style="background-color:#FFFF00">Initial Visit</span></strong></h3>          
                <ul>
                    <li>The patient would like to start on: ${highlightedMeds}.</li>
                    <li>${weightLossHistory}</li>
                    <li>The patient has tried the following medications in the past for weight loss: <span style="background-color:#FFFF00">None.</span></li>
                    <li>Starting weight: ${highlightedWeight}</li>
                    <li>Starting BMI: ${highlightedBMI}.</li>
                    <li>Goal weight: ${highlightedGoalWeight}</li>
                    <li>Last labs completed:</li>
                    <li>Local pharmacy:</li>
                </ul>
            </div>
            <button onclick="copyToClipboard('initialVisitAiSection')">Copy</button>


            <h1><strong>Vitals</strong></h1>
            <p>Current or average blood pressure range: <span style="background-color:#FFFF00">${bloodPressure}</span></p>
            <p>Current or average resting heart rate range: <span style="background-color:#FFFF00">${heartRate}</span></p>


            <h3><strong>Medical History</strong></h3>
            <p><strong>Past Medical History</strong><br>
            Denies PMHX: ${deniedConditions.join(', ')}.
            ${historyOf.length > 0 ? `<br><span style="background-color:#FFFF00">History of: ${[...new Set(historyOf)].join(', ')}</span>.` : ''}
            </p>

            <p><strong>Surgical History</strong><br>${surgicalHistory}</p>

            <p><strong>Family History</strong><br>
            ${conditions && conditions[1]?.includes("Personal or family history of thyroid cyst/nodule, thyroid cancer, medullary thyroid carcinoma, or multiple endocrine neoplasia syndrome type 2") ? 
                `<span style="background-color:#FFFF00">History of: Personal or family history of thyroid cyst/nodule, thyroid cancer, medullary thyroid carcinoma, or multiple endocrine neoplasia syndrome type 2</span>.` :
                `Denies family history of: Medullary thyroid cancer, multiple endocrine neoplasia type 2.`}
            </p>


            <p><strong>Social History</strong><br>
            ${conditions && conditions[1]?.includes("Drug or alcohol misuse") ? 
                `<span style="background-color:#FFFF00">History of: drug and alcohol misuse</span>` :
                `Denies drug and alcohol misuse`}
            </p>

             <h3><strong>Shipping Address</strong></h3>
            <p>
            ${hasPOBox ? 
                `<span style="background-color:#FFFF00">${shippingAddress}</span><br><span style="background-color:#FFFF00">Providers Note: Need to confirm patient's address as our pharmacies do not ship Rx's to PO Box.</span>` :
                `<span style="background-color:#FFFF00">${shippingAddress}</span>`}
            </p>
            
        </div>

                    `;
              
       resultDiv.innerHTML = result;
    });
});