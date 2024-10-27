document.addEventListener('DOMContentLoaded', function () {
    const encryptUploadNav = document.getElementById('encrypt-upload-nav');
    const decryptRetrieveNav = document.getElementById('decrypt-retrieve-nav');
    const introductionNav = document.getElementById('introduction-nav');

    const encryptUploadSection = document.getElementById('encrypt-upload-section');
    const decryptRetrieveSection = document.getElementById('decrypt-retrieve-section');
    const introductionSection = document.getElementById('introduction-section');

    const mainHeader = document.getElementById('main-header');
    const mainInterface = document.getElementById('main-interface');
    const messageBox = document.getElementById('message-box');
    const clearButtons = document.querySelectorAll('.clear-btn');
    const backButtons = document.querySelectorAll('.back-btn');

    // Function to hide all sections
    function hideAllSections() {
        encryptUploadSection.style.display = 'none';
        decryptRetrieveSection.style.display = 'none';
        introductionSection.style.display = 'none';
    }

    // Function to show the main interface with heading
    function showMainInterface() {
        mainHeader.style.display = 'block';
        mainInterface.style.display = 'block';
        hideAllSections();
    }

    // Initial display setup
    showMainInterface();

    // Event listeners for navigation
    encryptUploadNav.addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        mainHeader.style.display = 'none';
        mainInterface.style.display = 'none';
        encryptUploadSection.style.display = 'block';
    });

    decryptRetrieveNav.addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        mainHeader.style.display = 'none';
        mainInterface.style.display = 'none';
        decryptRetrieveSection.style.display = 'block';
    });

    introductionNav.addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        mainHeader.style.display = 'none';
        mainInterface.style.display = 'none';
        introductionSection.style.display = 'block';
    });

    // Click listeners for clear buttons
    clearButtons.forEach(button => {
        button.addEventListener('click', function () {
            resetTheme();
            clearForms();
            messageBox.textContent = ''; // Clear any messages
        });
    });

    // Click listeners for back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function () {
            showMainInterface();
        });
    });

    // Function to display a success message
    function showSuccessMessage(message) {
        messageBox.textContent = message || "Operation completed successfully!";
        messageBox.className = 'message success';
        messageBox.style.display = 'block';

        // Hide the message after 10 seconds
        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => {
                messageBox.style.display = 'none';
                messageBox.style.opacity = '1'; // Reset opacity for future messages
            }, 500); // Match this timeout to the transition duration in CSS
        }, 10000); // Show message for 10 seconds
    }

    // Function to display an error message and change the theme color to red
    function showErrorMessage(errorMsg) {
        messageBox.textContent = errorMsg || "Error: Please check your input and try again.";
        messageBox.className = 'message error';
        messageBox.style.display = 'block';
        document.body.classList.add('error-theme');
        setTimeout(() => {
            messageBox.style.display = 'none';
            document.body.classList.remove('error-theme');
        }, 10000); // Hide after 10 seconds
    }

    // Function to reset the theme back to default
    function resetTheme() {
        document.body.classList.remove('error-theme');
        messageBox.style.display = 'none';
    }

    // Function to clear all forms
    function clearForms() {
        document.querySelectorAll('input[type="file"], input[type="password"], input[type="text"]').forEach(input => {
            input.value = '';
        });
    }

    // File validation
    function validateFile(file) {
        // Accept any file type
        const maxSizeInMB = 50;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (file.size > maxSizeInBytes) {
            showErrorMessage('File size exceeds ${maxSizeInMB}MB. Please select a smaller file.');
            return false;
        }

        return true;
    }

    // Simulate encryption operation
    function encryptFile(file) {
        // Simulating a delay for the encryption process
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Random success or failure
                const operationSuccessful = Math.random() > 0.5;

                if (operationSuccessful) {
                    resolve('File encrypted successfully!');
                } else {
                    reject('Encryption failed. Please try again.');
                }
            }, 1000); // Simulating a delay of 1 second
        });
    }
    document.addEventListener('DOMContentLoaded', function() {
        // Display flash messages
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            message.style.display = 'block'; // Make sure it's visible
            setTimeout(() => {
                message.style.opacity = 0; // Fade out
                setTimeout(() => message.remove(), 500); // Remove after fade out
            }, 5000); // 5 seconds before fading out
    });
    });
    // Event listener for file encryption
    document.getElementById('encrypt-file-btn')?.addEventListener('click', function () {
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput?.files[0];

        if (!file) {
            showErrorMessage('No file selected. Please select a file to encrypt.');
            return;
        }

        // Validate the file
        if (validateFile(file)) {
            // Clear previous messages
            messageBox.style.display = 'none';

            // Perform the encryption operation
            encryptFile(file)
                .then(message => {
                    showSuccessMessage(message);
                })
                .catch(error => {
                    showErrorMessage(error);
                });
        }
    });

    // Event listener for file decryption
    document.getElementById('decrypt-file-btn')?.addEventListener('click', function () {
        const fileNameInput = document.getElementById('file_name');
        const fileName = fileNameInput?.value;

        if (!fileName) {
            showErrorMessage('File name is required for decryption.');
            return;
        }

        // Simulate a decryption operation
        // For actual implementation, send a request to the server for decryption
        showSuccessMessage('File decrypted successfully!'); // Simulate success

        // Redirect to main page after showing the message
        setTimeout(() => {
            showMainInterface(); // Redirect to main page after decryption
        }, 10000); // Redirect after 10 seconds (after message disappears)
    });
});