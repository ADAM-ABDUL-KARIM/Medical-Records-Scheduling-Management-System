function Availability({ availability , onDelete}) {
  return (
    <div className="rec-container">
      <p className="rec-content">Healthcare Professional Name: {availability.healthpro_name}</p>
      <p className="rec-content">Availability Start Time: {availability.availability_date}</p>
      <p className="rec-content">Availability Endtime: {availability.end_time}</p>
      <button className="delete-button" onClick={()=> onDelete(availability.availability_id)}>Delete</button>
    </div>
  );
}

export default Availability;