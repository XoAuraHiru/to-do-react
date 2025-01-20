import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import authService from "@/services/auth.service";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [error, setError] = useState("");

  const verifyEmail = useCallback(async () => {
    const token = searchParams.get("token");
    if (!token) {
      setVerificationStatus("error");
      setError("Verification token is missing");
      return;
    }

    try {
      const result = await authService.verifyEmail(token);
      if (result.success) {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
        setError(result.error || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationStatus("error");
      setError(err.response?.data?.message || "An unexpected error occurred");
    }
  }, [searchParams]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <>
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <h2 className="text-2xl font-bold text-center">
                  Verifying your email
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </CardContent>
          </>
        );

      case "success":
        return (
          <>
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-green-50 p-3 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-center">
                  Email verified!
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Your email has been successfully verified. You can now sign in
                to your account.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate("/login")}>
                Go to login
              </Button>
            </CardFooter>
          </>
        );

      case "error":
        return (
          <>
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-red-50 p-3 rounded-full">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-center">
                  Verification failed
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <p className="text-center text-muted-foreground mt-4">
                The email verification link may be invalid or expired.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Back to login
              </Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">{renderContent()}</Card>
    </div>
  );
};

export default VerifyEmail;
