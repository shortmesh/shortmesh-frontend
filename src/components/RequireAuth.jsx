// components/RequireAuth.js
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  // Check for a valid token and authentication flag
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const token = localStorage.getItem('token');
  const location = useLocation();

  console.log('RequireAuth: isAuthenticated =', isAuthenticated, 'token =', token);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
