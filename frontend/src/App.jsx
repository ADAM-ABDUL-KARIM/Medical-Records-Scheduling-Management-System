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
// import SideMenu from "./components/SideMenu";
import Notes from "./pages/Notes";
import RegisterHealthPro from "./pages/RegisterHealthPro";
import ExportPatients from "./pages/ExportPatients";
import PatientDashboard from "./pages/PatientDashboard"; 
import ProfileIcon from "./components/ProfileIcon"; 
import api from "./api";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import BackArrow from "./components/BackArrow";

import { ACCESS_TOKEN } from "./constants";

function Logout() {
  localStorage.clear();
  sessionStorage.clear();
  return <Navigate to="/login/" />;
}

function RegisterandLogout() {
  localStorage.clear();
  sessionStorage.clear();
  return <Register />;
}

function AppContent() {
  const location = useLocation();
  const [isPatient, setIsPatient] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch role if user is logged in
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      getUserRole();
    } else {
      setLoading(false);
    }
  }, []); // Run once on mount

  const getUserRole = async () => {
    try {
      const res = await api.get("/api/username/");
      const data = res.data;
      
      setIsPatient(data.is_patient);
      setIsAdmin(data.is_admin);
      
      console.log("User role fetched:", { 
        isPatient: data.is_patient, 
        isAdmin: data.is_admin 
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      // If there's an error, user might not be authenticated
      setIsPatient(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Determine if components should be hidden based on current route
  // const hideSideMenu = 
  //   isPatient === null ||
  //   location.pathname === "/login/" || 
  //   location.pathname === "/register" || 
  //   location.pathname === "/register/" || 
  //   location.pathname === "/login" || 
  //   location.pathname === "/";

  const hideProfileIcon = 
    location.pathname === "/login/" || 
    location.pathname === "/register" || 
    location.pathname === "/register/" || 
    location.pathname === "/login";

  // Show loading only on initial load
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#44546a'
      }}>
        Loading application...
      </div>
    );
  }
  
const isHome = location.pathname === "/" || location.pathname ==="/patient-dashboard";

  return (
    <>
       <BackArrow position={isHome ? "bottom" : "top"} />
      {/* {isPatient !== null && !hideSideMenu && <SideMenu isPatient={isPatient} />} */}
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
            <ProtectedRoute >
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
       
        {/* Patient/admin-specific routes */}
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute>
              <Appointments isPatient={isPatient} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/viewrecords" 
          element={
            <ProtectedRoute>
              <ViewPatientRecords isPatient={isPatient} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/availability" 
          element={
            <ProtectedRoute>
              <HealthCareAvailability isPatient={isPatient} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes isPatient={isPatient} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/export" 
          element={
            <ProtectedRoute>
              <ExportPatients isPatient={isPatient} />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin-only routes - these will render but backend will reject patient requests */}
        <Route 
          path="/writerecords" 
          element={
            <ProtectedRoute  allow={["admin"]}>
              <WriteRecords />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/registerhealthpro" 
          element={
            <ProtectedRoute allow={["admin"]} >
              <RegisterHealthPro />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register" 
          element={<RegisterandLogout />} 
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        
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