// components/RequireOnboarding.js
import { Navigate, useLocation } from 'react-router-dom';

const RequireOnboarding = ({ children }) => {
  const location = useLocation();
  const hasOnboarded = localStorage.getItem('hasOnboarded');

  if (hasOnboarded && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!hasOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default RequireOnboarding;
