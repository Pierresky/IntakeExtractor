document.addEventListener('DOMContentLoaded', () => {
    const initialVisitBtn = document.getElementById('initial-visit-btn');
    const refillVisitBtn = document.getElementById('refill-visit-btn');
    const initialSection = document.getElementById('initial-section');
    const refillSection = document.getElementById('refill-section');

    // Reset visit toggle
    function resetVisitToggle() {
        initialVisitBtn.classList.add('active');
        refillVisitBtn.classList.remove('active');
        initialSection.classList.remove('hidden');
        refillSection.classList.add('hidden');
    }

    // Initial setup
    resetVisitToggle();

    initialVisitBtn.addEventListener('click', () => {
        initialVisitBtn.classList.add('active');
        refillVisitBtn.classList.remove('active');
        initialSection.classList.remove('hidden');
        refillSection.classList.add('hidden');
    });

    refillVisitBtn.addEventListener('click', () => {
        refillVisitBtn.classList.add('active');
        initialVisitBtn.classList.remove('active');
        refillSection.classList.remove('hidden');
        initialSection.classList.add('hidden');
    });

    // Expose reset function globally if needed
    window.resetVisitToggle = resetVisitToggle;
});