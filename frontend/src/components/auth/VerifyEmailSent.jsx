
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

const VerifyEmailSent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MailCheck className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center">Check your email</h2>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            We&apos;ve sent you a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Didn&apos;t receive the email?</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Resend verification email
          </Button>
          <Link to="/login" className="w-full">
            <Button variant="ghost" className="w-full">
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailSent;