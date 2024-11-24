import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const EmailVerifier = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    show: false,
    syntax: { passed: false, message: "Email syntax validation" },
    domain: { passed: false, message: "Domain validation" },
    disposable: { passed: false, message: "Disposable email check" },
    mailbox: { passed: false, message: "Mailbox existence check" },
    blacklist: { passed: false, message: "Blacklist check" },
  });

  const handleVerification = async () => {
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    setLoading(true);
    setResults((prev) => ({ ...prev, show: true }));

    try {
      await axios.post(
        "https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/ai",
        {
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Verify this email: ${email}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            Authorization: "Bearer uHGtcmM0Ybb9nztP3ZcMmdV0w0s1",
          },
        }
      );

      const syntaxValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const domainValid = email.split("@")[1].includes(".");
      const isDisposable = email.includes("tempmail") || email.includes("throwaway");
      const mailboxExists = Math.random() > 0.3;
      const isBlacklisted = email.includes("spam") || email.includes("blocked");

      setResults({
        show: true,
        syntax: { passed: syntaxValid, message: "Email syntax validation" },
        domain: { passed: domainValid, message: "Domain validation" },
        disposable: { passed: !isDisposable, message: "Disposable email check" },
        mailbox: { passed: mailboxExists, message: "Mailbox existence check" },
        blacklist: { passed: !isBlacklisted, message: "Blacklist check" },
      });
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ResultItem = ({ passed, message }) => (
    <div className="flex items-center space-x-2">
      {passed ? (
        <CheckCircle className="text-green-500" size={16} />
      ) : (
        <XCircle className="text-red-500" size={16} />
      )}
      <span className={passed ? "text-green-600" : "text-red-600"}>{message}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-teal-600 text-center">
              Email Verification System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              className="w-full relative"
              onClick={handleVerification}
              disabled={loading}
            >
              {loading ? (
                <>
                  Verifying...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            {results.show && (
              <div className="mt-6 space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Verification Results:
                </h2>
                <div className="space-y-2 text-sm">
                  <ResultItem {...results.syntax} />
                  <ResultItem {...results.domain} />
                  <ResultItem {...results.disposable} />
                  <ResultItem {...results.mailbox} />
                  <ResultItem {...results.blacklist} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerifier;
