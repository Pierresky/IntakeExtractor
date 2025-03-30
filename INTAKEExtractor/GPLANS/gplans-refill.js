document.addEventListener('DOMContentLoaded', function() {
    const processRefillBtn = document.getElementById('process-refill-btn');
    const refillDataTextarea = document.getElementById('refillData');
    const resultDiv = document.getElementById('result');

    const medications = [
        "INJECTABLE semaglutide compound ( semaglutide sku_1 )",
        "INJECTABLE tirzepatide compound ( tirzepatide sku_2 )",
        "INJECTABLE Ozempic brand ( ozempic sku_3 )",
        "INJECTABLE Zepbound brand ( zepbound sku_4 )",
        "ORAL semaglutide compound( semaglutide sku_5 )",
        "ORAL metformin generic ( metformin sku_6 )",
        "ORAL tirzepatide compound ( compound_order ) ( tirzepatide sku_7 )"
    ];

    function extractMedication(refillData) {
        refillData = refillData.toLowerCase().replace(/\s+/g, ' ');
        
        for (let med of medications) {
            let normalizedMed = med.toLowerCase().replace(/\s+/g, ' ');
            if (refillData.includes(normalizedMed)) {
                return med;
            }
        }
        return null;
    }

    function formatMedication(medication) {
        return medication.replace(/\b(compound|brand|generic)\b|\(.*?\)/gi, '').trim();
    }

    function extractDoseOrInjection(refillData, isInjectable) {
        if (isInjectable) {
            const injectionMatch = refillData.match(/How many injections.*?\n(\d+-\d+ injections|\d+ injections|\d+-\d+|\d+)/);
            return injectionMatch && injectionMatch[1] !== '-' && injectionMatch[1].trim() !== '' ? `<span style="background-color:#FFFF00">${injectionMatch[1].replace(/(\d+.*?)/, '$1 injections')}</span>` : "";
        } else {
            const doseMatch = refillData.match(/How many daily tablet or troche.*?\n(0-7 doses|8-14 doses|15-21 doses|22-28 doses|More than 28 doses)/);
            return doseMatch && doseMatch[1] !== '-' && doseMatch[1].trim() !== '' ? `<span style="background-color:#FFFF00">${doseMatch[1].replace('doses', 'tablets')}</span>` : "";
        }
    }

    function extractLastDoseDate(refillData) {
        const lastDoseMatch = refillData.match(/When was your last dose of medication\?.*?\n(>\d+ days|\d+-\d+ days|\d+ days)/);
        return lastDoseMatch && lastDoseMatch[1] !== '-' && lastDoseMatch[1].trim() !== '' ? `<span style="background-color:#FFFF00">${lastDoseMatch[1]}</span>` : "";
    }

    function extractBloodPressure(refillData) {
        const bpMatch = refillData.match(/What is your current or average blood pressure range\?.*?\n(<120\/80 \(Normal\)|120-129\/<80 \(Elevated\)|130-139\/80-89 \(High Stage 1\)|≥140\/90 \(High Stage 2\) - Provider visit required)/);
        return bpMatch ? `<span style="background-color:#FFFF00">${bpMatch[1]}</span>` : "N/A";
    }

    function extractHeartRate(refillData) {
        const hrMatch = refillData.match(/What is your current or average resting heart rate range\?.*?\n(<60 beats per minute \(Slow\)|60-100 beats per minute \(Normal\)|101-110 beats per minute \(Slightly Fast\) - Provider visit required|>110 beats per minute \(Fast\) - Provider visit required)/);
        return hrMatch ? `<span style="background-color:#FFFF00">${hrMatch[1]}</span>` : "N/A";
    }

    processRefillBtn.addEventListener('click', function() {
        const refillData = refillDataTextarea.value;
                
        if (refillData.trim() === '') {
            alert('Please enter refill data');
            return;
        }

        const extractedMed = extractMedication(refillData);
        
        if (extractedMed) {
            const formattedMed = formatMedication(extractedMed);
            const isInjectable = extractedMed.toLowerCase().includes("injectable");
            const doseOrInjectionCount = extractDoseOrInjection(refillData, isInjectable);
            const lastDoseDate = extractLastDoseDate(refillData);
            const bloodPressure = extractBloodPressure(refillData);
            const heartRate = extractHeartRate(refillData);
            
            resultDiv.innerHTML = `
                <h3>GPLANS Refill Visit Processing</h3>
                <p><strong>Preferred Medication:</strong> ${formattedMed}</p>
                <h3><strong><span style="background-color:#FFFF00">Refill Visit</span></strong></h3>
                <p>The patient is currently on X mg of <span style="background-color:#FFFF00">${formattedMed}</span> for the last Z weeks.</p>
                <p>${isInjectable ? "Date of last injection:" : "Date of last doses:"} <span style="background-color:#FFFF00">${lastDoseDate}</span></p>
                <p>${isInjectable ? `How many injections has the patient taken on the current dose: ${doseOrInjectionCount}` : `How many doses has the patient taken on the current dose: ${doseOrInjectionCount}`}</p>
                
                <h3>Health Metrics</h3>
                <p><strong>Current or Average Blood Pressure Range:</strong> ${bloodPressure}</p>
                <p><strong>Current or Average Resting Heart Rate Range:</strong> ${heartRate}</p>
            `;
        } else {
            resultDiv.innerHTML = `<p style='color: red;'>No recognized medication found in the input.</p>`;
        }
    });
});
