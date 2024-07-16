const { authenticator } = otplib;

function getSecretFromURL() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('secret');
}

function updateTOTP(secret) {
    const totpCode = authenticator.generate(secret);
    document.getElementById('totp-code').textContent = totpCode;
    document.getElementById('progress-bar').style.width = '0';
    startProgressBar(secret);
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
    if(secret) updateTOTP(secret);
});


