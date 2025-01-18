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
import NavBar from "./components/NavBar";
import ExportPatientsExcel from "./pages/ExportPatientsExcel"; // Import the ExportPatientsExcel component
import ExportPatientsPDF from "./pages/ExportPatientsPDF"; // Import the ExportPatientsPDF component
import Notes from "./pages/Notes"
function Logout() {
  localStorage.clear();
  return <Navigate to="/login/" />;
}

function RegisterandLogout() {
  localStorage.clear();
  return <Register />;
}

function AppContent() {
  // hide navbar in log in and register pages
  const location = useLocation();
  const hideNavBar = location.pathname === "/login/" || location.pathname === "/register" ||location.pathname === "/register/" || location.pathname === "/login" || location.pathname === "/" ;

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/notes" element={<Notes />} />

        <Route path="/availability" element={<HealthCareAvailability />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/viewrecords" element={<ViewPatientRecrods />} />
        <Route path="/export/patient/excel" element={<ExportPatientsExcel />} />
        <Route path="/export/patient/pdf" element={<ExportPatientsPDF />} />
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