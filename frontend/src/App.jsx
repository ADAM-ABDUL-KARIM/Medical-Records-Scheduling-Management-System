import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import WriteRecords from "./pages/WriteRecords";
import Appointments from "./pages/Appointments";
import ViewPatientRecords from "./pages/ViewPatientRecords";
import HealthCareAvailability from "./pages/HealthCareAvailability";
import SideMenu from "./components/SideMenu";
import Notes from "./pages/Notes";
import RegisterHealthPro from "./pages/RegisterHealthPro";
import ExportPatients from "./pages/ExportPatients";
import PatientDashboard from "./pages/PatientDashboard"; 
import ProfileIcon from "./components/ProfileIcon"; 
import api from "./api";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login/" />;
}

function RegisterandLogout() {
  localStorage.clear();
  return <Register />;
}

function AppContent() {
  const location = useLocation();
  const [isPatient, setIsPatient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = () => {
    api
      .get("/api/username/")
      .then((res) => res.data)
      .then((data) => {
        setIsPatient(data.is_patient);
        setLoading(false); // Set loading to false after getting the user role
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Set loading to false even if there's an error
      });
  };

  const hideSideMenu = 
    location.pathname === "/login/" || 
    location.pathname === "/register" || 
    location.pathname === "/register/" || 
    location.pathname === "/login" || 
    location.pathname === "/" || 
    (isPatient && ["/viewrecords", "/appointments", "/availability","/notes"].includes(location.pathname));

  const hideProfileIcon = location.pathname === "/login/" || location.pathname === "/register" || location.pathname === "/register/" || location.pathname === "/login";

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching the user role
  }

  return (
    <>
      {!hideSideMenu && <SideMenu />}
      {!hideProfileIcon && <ProfileIcon isPatient={isPatient} />} 
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {isPatient ? <PatientDashboard /> : <Home />}
            </ProtectedRoute>
          }
        />
        <Route path="/registerhealthpro" element={<RegisterHealthPro />} />
        <Route path="/notes" element={<Notes isPatient={isPatient} />} />
        <Route path="/availability" element={<HealthCareAvailability isPatient={isPatient} />} />
        <Route path="/appointments" element={<Appointments isPatient={isPatient} />} />
        <Route path="/viewrecords" element={<ViewPatientRecords isPatient={isPatient} />} />
        <Route path="/export" element={<ExportPatients />} />
        <Route path="/WriteRecords" element={<WriteRecords />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterandLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;