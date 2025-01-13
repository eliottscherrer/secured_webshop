// HTML Elements
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const submitInput = document.getElementById('submitInput');

function validateForm() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === '' || password === '') {
        alert('Veuillez remplir tous les champs.');
        return false;
    }

    return true;
}

function validateLogin(){
    // TODO: Ask database
    return true;
}

// Event listeners
submitInput.addEventListener('click', function(event) {
    if (!validateForm() && validateLogin()) {
        event.preventDefault();
    } else {
        alert('Connecté avec succès!');
    }
});
