import react from "react"
import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"


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

        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/register" element={<RegisterandLogout />}/>
        <Route path ="*" element={<NotFound />}></Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
