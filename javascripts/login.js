document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // 🔒 blocca il refresh automatico

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Per favore inserisci username e password.");
        return;
    }


    // 🔁 Reindirizza
    window.location.href = "http://localhost:3000/Principale";
});
