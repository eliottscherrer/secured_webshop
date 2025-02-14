function validateForm() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        alert("Veuillez remplir tous les champs.");
        return false;
    }

    return true;
}

async function validateLogin(username, password) {
    try {
        const response = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status === 200) {
            const data = await response.json(); // Parse the response to retrieve additional data if needed
            return data; // Return the response data to use for redirection
        } else if (response.status === 401) {
            alert("Identifiants invalides.");
        } else if (response.status === 404) {
            alert("Utilisateur non trouvé.");
        } else {
            const data = await response.json();
            alert(`Erreur: ${data.message}`);
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
    }

    return null;
}

// Event listeners
submitInput.addEventListener("click", async function (event) {
    event.preventDefault();

    if (validateForm()) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const loginData = await validateLogin(username, password);

        if (loginData) {
            // Redirect to protected profile page
            window.location.href = `/profile`;
        }
    }
});
