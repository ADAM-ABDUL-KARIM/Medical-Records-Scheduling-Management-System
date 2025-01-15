import react from "react"
import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import WriteRecords from "./pages/WriteRecords"
import Appointments from "./pages/Appointments"
import ViewPatientRecrods from "./pages/ViewPatientRecrods"
import HealthCareAvailability from "./pages/HealthCareAvailability"
/**
 * 
 *  BrowserRouter: Wraps the application to enable routing.
Routes: Defines a set of routes.
Route: Defines a single route with a path and component to render.
Navigate: Programmatically navigates to a different route.
ProtectedRoute: Custom component to protect routes and check for authentication.
 */
function Logout (){

  localStorage.clear()
  return <Navigate to="/login/" />
}


function RegisterandLogout (){ 
  localStorage.clear
  return <Register/>
  
}
function App() {


 return (
// <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <BrowserRouter>
      <Routes>
        <Route
        path="/"
        element={
          <ProtectedRoute>
            {/* access Home unless you an access Token */}
       
            <Home/>
          </ProtectedRoute>
        }
        />
      
      <Route path="/availability" element={<HealthCareAvailability/>}/>
      <Route path="/appointments" element={<Appointments />}/>
      <Route path="/viewrecords" element={<ViewPatientRecrods />}/>
    
       <Route path="/WriteRecords" element={<WriteRecords />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/register" element={<RegisterandLogout />}/>
        <Route path ="*" element={<NotFound />}></Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
