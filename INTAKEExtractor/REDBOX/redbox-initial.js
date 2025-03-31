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

        // Extract sex
        const sexMatch = intakeData.match(/What sex is listed on your birth certificate\?\s*(Male|Female)/i);
        let RBIsex = "male / female";
        if (sexMatch) {
            const detectedSex = sexMatch[1].toLowerCase();
            RBIsex = RBIsex.replace(new RegExp(detectedSex, 'i'), '<span style="background-color: #ffff00">' + detectedSex + '</span>');
        }

        // Extract weight
        const weightMatch = intakeData.match(/Weight \(lbs\.\)\s*(\d+)/i);
        const RBIweight = weightMatch ? weightMatch[1] : 'Unknown';

        // Extract BMI
        const bmiMatch = intakeData.match(/BMI\s*(\d+\.?\d*)/i);
        const RBIbmi = bmiMatch ? bmiMatch[1] : 'Unknown';

        // Extract weight loss goal
        const goalMatch = intakeData.match(/What is your weight loss goal\?\s*(.*)/i);
        let RBIgoalWeight = goalMatch ? goalMatch[1].trim() : '';
        const validGoals = [
            "Lose 1-20 Ibs",
            "Lose 21-50 Ibs",
            "Lose over 50 Ibs",
            "Maintain my current weight",
            "Haven't decided"
        ];

        if (["-", "none", ""].includes(RBIgoalWeight.toLowerCase())) {
            RBIgoalWeight = "";
        } else if (!validGoals.includes(RBIgoalWeight) && !RBIgoalWeight.match(/^\d+$/)) {
            RBIgoalWeight = "";
        }

        if (RBIgoalWeight) {
            RBIgoalWeight = `<span style="background-color: #ffff00">${RBIgoalWeight}</span>`;
        }

        // Extract medication use for weight loss
        const medMatch = intakeData.match(/Have you taken medication for weight loss in the last 12 months\?\s*(.*)/i);
        let RBImedication = "<span style=\"background-color: #ffff00\">denied</span>";

        if (medMatch) {
            const answer = medMatch[1].trim().toLowerCase();
            if (answer.includes("glp-1")) {
                RBImedication = "<span style=\"background-color: #ffff00\">GLP-1 medication</span>";
            } else if (answer.includes("another medication")) {
                RBImedication = "<span style=\"background-color: #ffff00\">Another weight loss medication</span>";
            } else if (answer.toLowerCase() !== "no") {
                RBImedication = `<span style=\"background-color: #ffff00\">${answer}</span>`;
            }
        }

        // Extract preferred medication
        const preferredMedMatch = intakeData.match(/Weight Management Preferred Medication\|wm-preferred\s*(.*)/i);
        let RBIpreferredMed = "";
        
        if (preferredMedMatch) {
            const preferredMed = preferredMedMatch[1].trim().split(" ").slice(0, 3).join(" ");
            RBIpreferredMed = `<span style="background-color: #ffff00">${preferredMed}</span>`;
        }

        // Extract nausea prescription request
        const nauseaMatch = intakeData.match(/Would you like a prescription for ondansetron \(Zofran\)\?.*?\s*(Yes|No)/i);
        let providerNote = "";

        if (nauseaMatch && nauseaMatch[1].toLowerCase() === "yes") {
            providerNote = `<p><b><span style="background-color: #ffff00">Providers Note: The patient is requesting anti-nausea medication</span></b></p>`;
        }

        // Format the extracted data
        const RedBoxresult = `
            ${providerNote}
            <p>This is a __ y/o <b>obese / overweight ${RBIsex} </b> who is seeking medical weight loss treatment.</p>
            <h3><b><span style="background-color: #ffff00">Initial Visit:</span></b></h3>
            <ul>
                <li>Comorbidities:</li>
                <li>Medication(s) patient has tried in the past for weight loss: ${RBImedication}</li>
                <li>Medication patient would like to start on today: ${RBIpreferredMed}</li>
                <li>Initial visit weight: <span style="background-color: #ffff00">${RBIweight} lbs</span></li>
                <li>Initial visit BMI: <span style="background-color: #ffff00">${RBIbmi}</span></li>
                <li>Patient's goal weight: ${RBIgoalWeight}</li>
                <li>Patient's goal BMI:</li>
            </ul>

            <h3><b>Follow-Up Visit:</b></h3>
            <ul>
                <li>Patient is currently on the following medication:
                    <ul>
                        <li>Name, mg dose, and compound pharmacy (if applicable):</li>
                        <li>For the past __ weeks:</li>
                    </ul>
                </li>
            </ul>
        `;
        
        resultDiv.innerHTML = RedBoxresult;
    });
});
