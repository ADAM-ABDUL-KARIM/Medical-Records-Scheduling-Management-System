import { Link } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/notes">Notes</Link></li>
                <li><Link to="/viewrecords">View Records</Link></li>
                <li><Link to="/writerecords">Write Records</Link></li>
                <li><Link to="/registerhealthpro">Register Healthcare Professional</Link></li>
                <li><Link to="/appointments">Appointments</Link></li>
                <li><Link to="/availability">Availability</Link></li>
                <li><Link to="/export/patient/excel">Export Patients (Excel)</Link></li>
                <li><Link to="/export/patient/pdf">Export Patients (PDF)</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar;