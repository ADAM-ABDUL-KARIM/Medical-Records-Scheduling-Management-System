import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isPatient, setIsPatient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth().catch(() => {
      setIsAuthorized(false);
      setIsLoading(false);
    });
  }, []); // Remove dependency - only run once on mount

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
        return true;
      } else {
        setIsAuthorized(false);
        return false;
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
      return false;
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    // Refresh token if expired
    if (tokenExpiration < now) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        setIsLoading(false);
        return;
      }
    } else {
      setIsAuthorized(true);
    }

    // Fetch user role AFTER token is validated
    try {
      const res = await api.get("/api/username/");
      const data = res.data;
      setIsPatient(data.is_patient);
      setIsAuthorized(true);
    } catch (error) {
      console.log("Error fetching user role:", error);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isLoading || isAuthorized === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#44546a'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authorized
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // Redirect patients from admin home to patient dashboard
  if (isAuthorized && isPatient && window.location.pathname === "/") {
    return <Navigate to="/patient-dashboard" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;