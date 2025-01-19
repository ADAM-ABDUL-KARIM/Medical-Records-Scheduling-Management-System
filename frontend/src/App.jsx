import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import WriteRecords from "./pages/WriteRecords";
import Appointments from "./pages/Appointments";
import ViewPatientRecrods from "./pages/ViewPatientRecrods";
import HealthCareAvailability from "./pages/HealthCareAvailability";
import SideMenu from "./components/SideMenu"; // Import the SideMenu component
import Notes from "./pages/Notes";
import RegisterHealthPro from "./pages/RegisterHealthPro";
import ExportPatients from "./pages/ExportPatients"; // Import the unified export page

function Logout() {
  localStorage.clear();
  return <Navigate to="/login/" />;
}

function RegisterandLogout() {
  localStorage.clear();
  return <Register />;
}

function AppContent() {
  // hide side menu in log in and register pages
  const location = useLocation();
  const hideSideMenu = location.pathname === "/login/" || location.pathname === "/register" || location.pathname === "/register/" || location.pathname === "/login" || location.pathname === "/";

  return (
    <>
      {!hideSideMenu && <SideMenu />} {/* Add the SideMenu component */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/registerhealthpro" element={<RegisterHealthPro />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/availability" element={<HealthCareAvailability />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/viewrecords" element={<ViewPatientRecrods />} />
        <Route path="/export" element={<ExportPatients />} /> {/* Update the export route */}
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