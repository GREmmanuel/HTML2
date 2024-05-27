document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('personalityForm');
    const likertButtons = document.querySelectorAll('.likert-scale button');

    // Set the timestamp in local storage when the page is first loaded
    if (!localStorage.getItem('startTime')) {
        localStorage.setItem('startTime', new Date().getTime());
    }

    // Check the time elapsed since the page was first loaded
    function checkTimeElapsed() {
        const startTime = localStorage.getItem('startTime');
        const currentTime = new Date().getTime();
        const elapsed = currentTime - startTime;

        const oneHour = 999 * 60 * 60 * 1000; // One hour in milliseconds

        if (elapsed > oneHour) {
            form.innerHTML = "<p>This form is no longer available. The time limit has expired.</p>";
            form.style.textAlign = "center";
            form.style.color = "red";
            return false;
        }
        return true;
    }

    // Function to handle button selection
    function handleButtonClick(event) {
        const selectedButton = event.target;
        const buttonGroup = selectedButton.closest('.likert-scale');
        const allButtons = buttonGroup.querySelectorAll('button');

        // Deselect all buttons in the same group
        allButtons.forEach(button => {
            button.classList.remove('selected');
        });

        // Toggle 'selected' class for the clicked button
        selectedButton.classList.add('selected');
    }

    // Function to handle form submission
    function handleSubmit(event) {
        event.preventDefault();

        if (!checkTimeElapsed()) {
            return;
        }

        const selectedValues = {};
        let allQuestionsAnswered = true;

        likertButtons.forEach(button => {
            if (button.classList.contains('selected')) {
                selectedValues[button.name] = button.value;
            }
        });

        const questions = form.querySelectorAll('.question-group');
        questions.forEach(group => {
            const errorMessages = group.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.textContent = '');

            const buttons = group.querySelectorAll('button');
            const groupName = buttons[0].name;
            const isAnswered = !!selectedValues[groupName];

            if (!isAnswered) {
                allQuestionsAnswered = false;
                const errorMessage = group.querySelector('.error-message');
                errorMessage.textContent = 'Please answer this question.';
            }
        });

        if (!allQuestionsAnswered) {
            return;
        }

        // Store the selected values in local storage
        localStorage.setItem('formData', JSON.stringify(selectedValues));

        // Redirect to the results page
        window.location.href = 'result2.html';
    }

    // Event listeners
    likertButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    form.addEventListener('submit', handleSubmit);

    // Check time elapsed on page load
    checkTimeElapsed();
});
