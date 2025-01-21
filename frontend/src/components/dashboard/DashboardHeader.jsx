import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="text-2xl font-bold">
          Welcome, {user?.firstName}!
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your tasks below
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          asChild
        >
          <Link to="/profile">
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Link>
        </Button>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </CardHeader>
  );
};

DashboardHeader.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }),
  onLogout: PropTypes.func.isRequired
};

DashboardHeader.defaultProps = {
  user: null
};

export default DashboardHeader;