import PropTypes from 'prop-types';

export const TaskShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  scheduledFor: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired
});

export const TaskEditableProps = {
  editingTask: PropTypes.string,
  editText: PropTypes.string.isRequired,
  editDate: PropTypes.string.isRequired,
  editTime: PropTypes.string.isRequired
};

export const TaskCallbacks = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  onEditTextChange: PropTypes.func.isRequired,
  onEditDateChange: PropTypes.func.isRequired,
  onEditTimeChange: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  isUpcoming: PropTypes.func.isRequired,
  formatDateTime: PropTypes.func.isRequired
};

export const FormProps = {
    newTask: PropTypes.string.isRequired,
    scheduledDate: PropTypes.string.isRequired,
    scheduledTime: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onTaskChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };