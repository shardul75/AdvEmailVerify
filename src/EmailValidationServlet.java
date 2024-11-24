import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// Main Servlet for handling email validation requests
@WebServlet("/validateEmail")
public class EmailValidationServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Get email from request
        String email = request.getParameter("email");

        // Initialize the response message
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

    // Method to validate email syntax
    private boolean isValidSyntax(String email) {
        // Regex for validating email syntax
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    // Method to check if domain is valid
    private boolean isDomainValid(String email) {
        try {
            // Extract domain
            String domain = email.substring(email.indexOf('@') + 1);
            // Perform DNS lookup
            java.net.InetAddress.getByName(domain);
            return true;
        } catch (Exception e) {
            return false; // Domain does not exist
        }
    }

    // Method to detect disposable email addresses
    private boolean isDisposableEmail(String email) {
        // Common disposable email domains (example list)
        String[] disposableDomains = { "mailinator.com", "tempmail.com", "10minutemail.com" };
        String domain = email.substring(email.indexOf('@') + 1);
        for (String disposable : disposableDomains) {
            if (domain.equalsIgnoreCase(disposable)) {
                return true;
            }
        }
        return false;
    }

    // Method to check blacklist
    private boolean isBlacklisted(String email) {
        // Example: simple static blacklist (can be extended to a database check)
        String[] blacklistedEmails = { "blacklisted@example.com", "spam@domain.com" };
        for (String blacklisted : blacklistedEmails) {
            if (email.equalsIgnoreCase(blacklisted)) {
                return true;
            }
        }
        return false;
    }

    // Method to validate SMTP
    private boolean isSMTPValid(String email) {
        // Extract domain
        String domain = email.substring(email.indexOf('@') + 1);
        try {
            // Try connecting to the SMTP server (port 25)
            java.net.Socket socket = new java.net.Socket(domain, 25);
            socket.close();
            return true; // Connection successful
        } catch (Exception e) {
            return false; // SMTP validation failed
        }
    }
}
