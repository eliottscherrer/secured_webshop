// Consts
const minimumCharsInPass = 5;

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

    if (password.length < minimumCharsInPass) {
        alert(`Le mot de passe doit contenir au moins ${minimumCharsInPass} caractères.`);
        return false;
    }

    return true;
}

// Event listeners
submitInput.addEventListener('click', function(event) {
    if (!validateForm()) {
        event.preventDefault();
    } else {
        alert('Compte créé avec succès!');
        // TODO : Send data to server
    }
});
