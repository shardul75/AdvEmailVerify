const express = require('express');
const dns = require('dns');
const emailVerifier = require('email-verifier');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // Serve static files like HTML, CSS, JS
app.use(express.json());

// Email verification endpoint
app.post('/verify-email', (req, res) => {
    const email = req.body.email;
    
    // Syntax validation using a regex
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

        // Optionally, integrate SMTP verification here for further checks
        // For simplicity, we are skipping that step here

        // Check for disposable email providers (hardcoded list as an example)
        const disposableDomains = ['tempmail.com', '10minutemail.com'];
        if (disposableDomains.includes(domain)) {
            return res.json({ message: 'Disposable email detected' });
        }

        // If everything looks good
        return res.json({ message: 'Email is valid!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
