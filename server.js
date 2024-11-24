const express = require('express');
const dns = require('dns');
const app = express();
const PORT = 3000;

app.use(express.static('public'));  // Serve static files from the 'public' folder
app.use(express.json());  // Middleware to parse JSON request bodies

// Email verification endpoint
app.post('/verify-email', (req, res) => {
    const email = req.body.email;

    // Syntax validation using a regular expression
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.json({ message: 'Invalid email syntax' });
    }

    // Extract domain from email
    const domain = email.split('@')[1];

    // Domain existence check using DNS lookup
    dns.resolve(domain, 'MX', (err, addresses) => {
        if (err || !addresses.length) {
            return res.json({ message: 'Domain does not exist or has no MX records' });
        }

        // Check for disposable email providers (example list)
        const disposableDomains = ['tempmail.com', '10minutemail.com'];
        if (disposableDomains.includes(domain)) {
            return res.json({ message: 'Disposable email detected' });
        }

        // If everything looks good
        return res.json({ message: 'Email is valid!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
