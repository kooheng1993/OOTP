const { authenticator } = otplib;

function getSecretFromURL() {
    const queryParams = new URLSearchParams(window.location.search);
    const secret = queryParams.get('secret');
    console.log("Retrieved secret:", secret);  // Debug log
    return secret;
}

function updateTOTP(secret) {
    try {
        const totpCode = authenticator.generate(secret);
        document.getElementById('totp-code').textContent = totpCode;
        console.log("Generated TOTP code:", totpCode);  // Debug log
        document.getElementById('progress-bar').style.width = '0';
        startProgressBar(secret);
    } catch (error) {
        console.error("Error generating TOTP:", error);
        document.getElementById('totp-code').textContent = "Error in TOTP Generation";
    }
}

function copyCodeToClipboard() {
    const codeElement = document.getElementById('totp-code');
    const code = codeElement.textContent;

    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    showAlert('2FA code copied to clipboard!');
}

function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.className = 'alert-box';
    document.body.appendChild(alertBox);

    setTimeout(() => {
        document.body.removeChild(alertBox);
    }, 2000);
}

function startProgressBar(secret) {
    const progressBar = document.getElementById('progress-bar');
    const countdownElement = document.getElementById('countdown');
    const totpInterval = authenticator.options.step || 30; // Default step is 30 seconds
    const startTime = Math.floor(Date.now() / 1000);
    const timeLeft = totpInterval - (startTime % totpInterval);

    let timeRemaining = timeLeft;

    countdownElement.textContent = `Time left: ${timeRemaining}s`;

    // Clear any existing intervals
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }

    // Update progress bar and countdown every second
    window.progressInterval = setInterval(() => {
        timeRemaining--;
        countdownElement.textContent = `Time left: ${timeRemaining}s`;
        const width = ((timeLeft - timeRemaining) / timeLeft) * 100;
        progressBar.style.width = width + '%';

        if (timeRemaining <= 0) {
            clearInterval(window.progressInterval);
            updateTOTP(secret); // Update TOTP code every interval
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    const secret = getSecretFromURL();
    if (secret) {
        updateTOTP(secret);
    } else {
        console.log("No secret key provided.");
        document.getElementById('totp-code').textContent = "No Secret Key Provided";
    }

    document.getElementById('totp-code').addEventListener('click', copyCodeToClipboard);
});
