import "../styles/InputForms.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function Availability({ availability, onDelete, showDeleteButton = true }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this availability?",
      buttons: [
        {
          label: "Yes",
          onClick: () => onDelete(availability.availability_id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const formatDateTime = (dateTime) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTime).toLocaleDateString(undefined, options);
  };

  return (
    <div className="availability-container">
      <p>
        <span>Healthcare Professional Name:</span> {availability.healthpro_name}
      </p>
      <p>
        <span>Availability Start Time:</span>{" "}
        {formatDateTime(availability.availability_date)}
      </p>
      <p>
        <span>Availability End Time:</span> {availability.end_time}
      </p>
      {showDeleteButton && (
        <button className="delete-button" onClick={handleDeleteClick}>
          Delete
        </button>
      )}
    </div>
  );
}

export default Availability;
