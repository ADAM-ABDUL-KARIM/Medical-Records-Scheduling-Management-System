import { Navigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ProtectedRoute({ children, allow }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isPatient, setIsPatient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    auth().catch(() => {
      setIsAuthorized(false);
      setIsLoading(false);
    });
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        return true;
      }
      return false;
    } catch {
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
    if (decoded.exp < Date.now() / 1000) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await api.get("/api/username/");
      setIsPatient(res.data.is_patient);
      setIsAuthorized(true);
    } catch {
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  const role = isPatient ? "patient" : "admin";

  if (allow && !allow.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  if (isPatient && location.pathname === "/") {
    return <Navigate to="/patient-dashboard" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allow: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;