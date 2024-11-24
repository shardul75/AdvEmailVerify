document.getElementById('email-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from reloading the page

    const email = document.getElementById('email').value;

    // Send the email to the server for validation
    fetch('/verify-email', {
        method: 'POST',  // POST request to the server
        headers: {
            'Content-Type': 'application/json',  // Send the data as JSON
        },
        body: JSON.stringify({ email })  // Pass the email in the request body
    })
    .then(response => response.json())  // Parse the JSON response from the server
    .then(data => {
        // Display the result in the <p id="result"></p>
        document.getElementById('result').textContent = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
