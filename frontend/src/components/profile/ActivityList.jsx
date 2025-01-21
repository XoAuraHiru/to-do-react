import PropTypes from 'prop-types';
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const ActivityList = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No activity to show
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity._id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div>
            <p className="font-medium">{activity.action}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ActivityList;