import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { validateName, isValidEmail } from "../../helpers/validation";

const ProfileForm = ({
  profileData,
  onSubmit,
  onChange,
  isSubmitting,
  error,
  successMessage,
}) => {
  const validateField = (field, value) => {
    switch (field) {
      case "firstName":
      case "lastName": {
        const nameValidation = validateName(
          value,
          field === "firstName" ? "First name" : "Last name"
        );
        return nameValidation.isValid ? null : nameValidation.error;
      }
      case "email":
        return isValidEmail(value)
          ? null
          : "Please enter a valid email address";
      default:
        return null;
    }
  };

  const handleChange = (field, value) => {
    const validationError = validateField(field, value);
    // Only update if validation passes
    if (!validationError) {
      onChange(field, value);
    }
    return validationError;
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 text-green-700 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

ProfileForm.propTypes = {
  profileData: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  successMessage: PropTypes.string,
};

export default ProfileForm;
