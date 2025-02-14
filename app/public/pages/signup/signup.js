// Constants
const minimumCharsInPass = 5;

// HTML Elements
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const submitInput = document.getElementById("submitInput");

function validateForm() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        alert("Veuillez remplir tous les champs.");
        return false;
    }

    if (password.length < minimumCharsInPass) {
        alert(
            `Le mot de passe doit contenir au moins ${minimumCharsInPass} caractères.`
        );
        return false;
    }

    return true;
}

// Event listeners
submitInput.addEventListener("click", async function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        const response = await fetch("/api/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        if (response.ok) {
            // Notify success and redirect to profile page
            alert(result.message);
            window.location.href = "/profile";
        } else {
            alert(result.message || "Une erreur est survenue.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Une erreur est survenue.");
    }
});
