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


function startProgressBar(secret) {
    let width = 0;
    const progressBar = document.getElementById('progress-bar');
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            updateTOTP(secret);
        } else {
            width += 1;
            progressBar.style.width = width + '%';
        }
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const secret = getSecretFromURL();
    if (secret) {
        updateTOTP(secret);
    } else {
        console.log("No secret key provided.");
        document.getElementById('totp-code').textContent = "No Secret Key Provided";
    }
});
