// Import the otplib module (TOTP library)
const { authenticator } = otplib;

function getSecretFromURL() {
    const url = window.location.href;
    const secret = url.split('/').pop();
    return secret;
}

function updateTOTP(secret) {
    const totpCode = authenticator.generate(secret);
    document.getElementById('totp-code').textContent = totpCode;

    // Reset progress bar
    document.getElementById('progress-bar').style.width = '0';
    startProgressBar(secret);
}

function startProgressBar(secret) {
    let width = 0;
    const progressBar = document.getElementById('progress-bar');
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            updateTOTP(secret);  // Update TOTP code every 30 seconds
        } else {
            width += 1;  // Increment width by 1% every 300ms (30 seconds for full width)
            progressBar.style.width = width + '%';
        }
    }, 300);
}

// Initialize TOTP code and progress bar on page load
document.addEventListener('DOMContentLoaded', () => {
    const secret = getSecretFromURL();
    updateTOTP(secret);
});
