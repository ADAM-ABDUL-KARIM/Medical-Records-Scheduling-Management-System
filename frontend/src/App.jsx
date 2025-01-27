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
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

function Logout() {
  localStorage.clear();
  // window.location.reload();
  sessionStorage.clear();// Clear session storage/cache to avoid unexpected behavior 
  return <Navigate to="/login/" />;
}

function RegisterandLogout() {
  localStorage.clear();
  sessionStorage.clear();
  return <Register />;
}

function AppContent() {
  const location = useLocation();
  const [isPatient, setIsPatient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserRole();
  }, [location.pathname]);// Re-fetch roles when the route changes

  const getUserRole = async () => {
    try {
      const res = await api.get("/api/username/");
      const data = res.data;
      setIsPatient(data.is_patient);
      setIsAdmin(data.is_admin);
      setLoading(false); // Set loading to false after getting the user role
    } catch (error) {
      console.error(error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  const hideSideMenu = 
    isPatient ||
    location.pathname === "/login/" || 
    location.pathname === "/register" || 
    location.pathname === "/register/" || 
    location.pathname === "/login" || 
    location.pathname === "/";

  const hideProfileIcon = 
    location.pathname === "/login/" || 
    location.pathname === "/register" || 
    location.pathname === "/register/" || 
    location.pathname === "/login";

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching the user role
  }

  return (
    <>
      {!hideSideMenu && <SideMenu isPatient={isPatient} />}
      {!hideProfileIcon && <ProfileIcon isPatient={isPatient} />} 
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
       
        {/* Patient/admin-specific routes */}
        <Route path="/appointments" element={<ProtectedRoute><Appointments isPatient={isPatient} /></ProtectedRoute>} />
        <Route path="/viewrecords" element={<ProtectedRoute><ViewPatientRecords isPatient={isPatient} /></ProtectedRoute>} />
        <Route path="/availability" element={<ProtectedRoute><HealthCareAvailability isPatient={isPatient} /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes isPatient={isPatient} /></ProtectedRoute>} />
        <Route path="/export" element={<ProtectedRoute><ExportPatients isPatient={isPatient} /></ProtectedRoute>} />
        
        {/* Admin-specific routes */}
        {!isPatient && (
          <>
            <Route path="/writerecords" element={<ProtectedRoute><WriteRecords /></ProtectedRoute>} />
            <Route path="/registerhealthpro" element={<ProtectedRoute><RegisterHealthPro /></ProtectedRoute>} />
            <Route path="/register" element={<RegisterandLogout />} />
            
            <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
           
          </>
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        
        <Route path="*" element={<NotFound />} />
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