import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import authService from '@/services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Password reset request failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-green-50 p-3 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-center">Check your email</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              If an account exists with {email}, you will receive a password reset link shortly.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                Back to login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Reset your password</h2>
          <p className="text-center text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending reset link...' : 'Send reset link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link 
            to="/login"
            className="text-sm text-primary hover:underline"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;