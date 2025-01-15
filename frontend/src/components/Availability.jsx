function Availability({ availability }) {
  return (
    <div className="rec-container">
      <p className="rec-content">Healthcare Professional Name: {availability.healthpro_name}</p>
      <p className="rec-content">Availability Start Time: {availability.availability_date}</p>
      <p className="rec-content">Availability Endtime: {availability.end_time}</p>
    </div>
  );
}

export default Availability;