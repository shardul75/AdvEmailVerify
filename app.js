// Function to handle form submission
document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Verifying...'; // Display a loading message

    // Call the backend to validate the email
    fetch('/verify-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        // Show the verification result
        resultDiv.innerHTML = `<p>${data.message}</p>`;
    })
    .catch(error => {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});
