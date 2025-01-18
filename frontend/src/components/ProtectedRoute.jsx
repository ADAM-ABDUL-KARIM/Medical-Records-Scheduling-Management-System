// this will represent a wrapper for a protected route - as we need an authorization token to access this route

import { Navigate } from "react-router-dom"

import jwtDecode  from "jwt-decode";
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState ,useEffect} from "react"


function ProtectedRoute({ children }) {
    // first step to check if authorized to access this route-otherwise log in before using this
    // state hook
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(()=> {
        auth().catch(()=> setIsAuthorized(false))} 
        ,[])

        
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            // send it to the backend
            // refresh is payload
            const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
            
            if (res.status === 200 ) { 
                localStorage.setItem(ACCESS_TOKEN,res.data.access)
                setIsAuthorized(true)
            }else { 
                setIsAuthorized(false)
            }

        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        // give access to the value and expiration date
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp;
        // get the date in seconds not ms
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }
    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute

// Remove the ProtectedRoute component or modify it to always allow access

// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//     // Always allow access
//     return children;
// }

// export default ProtectedRoute;