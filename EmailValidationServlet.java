package com.example.emailvalidation;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// Servlet for email validation
@WebServlet("/validateEmail")
public class EmailValidationServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Extract email parameter from request
        String email = request.getParameter("email");

        // Result message for validation outcome
        String resultMessage;

        // Perform validations
        if (!isValidSyntax(email)) {
            resultMessage = "Invalid email syntax.";
        } else if (!isDomainValid(email)) {
            resultMessage = "Invalid or non-existent domain.";
        } else if (isDisposableEmail(email)) {
            resultMessage = "Disposable email addresses are not allowed.";
        } else if (isBlacklisted(email)) {
            resultMessage = "Email address is blacklisted.";
        } else if (!isSMTPValid(email)) {
            resultMessage = "SMTP validation failed.";
        } else {
            resultMessage = "Email address is valid.";
        }

        // Send the result back to the client
        response.setContentType("text/plain");
        response.getWriter().write(resultMessage);
    }

    // Validates email syntax using a regex pattern
    private boolean isValidSyntax(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    // Checks if the domain exists using DNS lookup
    private boolean isDomainValid(String email) {
        try {
            String domain = email.substring(email.indexOf('@') + 1);
            java.net.InetAddress.getByName(domain);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Detects if the email is from a disposable email provider
    private boolean isDisposableEmail(String email) {
        String[] disposableDomains = { "mailinator.com", "tempmail.com", "10minutemail.com" };
        String domain = email.substring(email.indexOf('@') + 1);
        for (String disposable : disposableDomains) {
            if (domain.equalsIgnoreCase(disposable)) {
                return true;
            }
        }
        return false;
    }

    // Checks if the email address is in a blacklist
    private boolean isBlacklisted(String email) {
        String[] blacklistedEmails = { "blacklisted@example.com", "spam@domain.com" };
        for (String blacklisted : blacklistedEmails) {
            if (email.equalsIgnoreCase(blacklisted)) {
                return true;
            }
        }
        return false;
    }

    // Validates email via SMTP by attempting a connection
    private boolean isSMTPValid(String email) {
        String domain = email.substring(email.indexOf('@') + 1);
        try {
            java.net.Socket socket = new java.net.Socket(domain, 25);
            socket.close();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
