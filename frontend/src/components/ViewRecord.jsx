import "../styles/Record.css"

function ViewRecord ({Record,onDelete}){

    return (

        <div className="rec-container">
            
            <p className="rec-content"><b>First Name:</b> {Record.first_name}</p>
            <p className="rec-content"><b>Last Name: </b>{Record.last_name}</p>
            <p className="rec-content"><b>Date Of Birth: </b>{Record.dob}</p>
            <p className="rec-content"><b>Nationality: </b>{Record.nationality}</p>
            <p className="rec-content"><b>Marital Status:</b> {Record.marital_status}</p>
            <p className="rec-content"><b>Phone Number:</b> {Record.phone_number}</p>
            <p className="rec-content"><b>Gender: </b>{Record.gender}</p>
            <p className="rec-content"><b>Height:</b> {Record.height} cm</p>
            <p className="rec-content"><b>Educational Level: </b>{Record.educational_level}</p>
            <p className="rec-content"><b>Employment Status: </b>{Record.employment_status}</p>
            <p className="rec-content"><b>Dominant Hand: </b>{Record.dominant_hand}</p>
            <p className="rec-date"><b>Start Date: </b>{Record.start_date}</p>
            <p className="rec-content"><b>Activity Level:</b> {Record.activity_level}</p>
            <p className="rec-content"><b>Recovered:</b>{Record.is_recovered ? "Yes" : "No"}</p>
          <button className="delete-button" onClick={() => onDelete(Record.file_number)}>Delete</button>
      
        </div>

    );

}
export default ViewRecord;