/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  console.log("Current Location:", location);

  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    console.log("User not authenticated. Redirecting to signin.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("User is authenticated. Rendering children.");
  return children;
};

export default ProtectedRoute;